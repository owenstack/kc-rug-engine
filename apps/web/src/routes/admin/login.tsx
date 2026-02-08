import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/admin/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate({
		from: "/",
	});

	const formSchema = z.object({
		email: z
			.email({ error: "Invalid email address" })
			.refine((val) => val.endsWith("@efobi.dev"), {
				error: "Email domain not allowed",
			}),
		password: z
			.string()
			.min(8, { error: "Password must be at least 8 characters" }),
	});

	const { mutateAsync, isPending } = useMutation(
		orpc.admin.login.mutationOptions(),
	);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			toast.promise(mutateAsync(value), {
				loading: "Signing in...",
				success: () => {
					navigate({
						to: "/admin",
					});
					return "Signed in successfully";
				},
				error: (err) => {
					return err.message || "Failed to sign in";
				},
			});
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="font-bold text-3xl tracking-tight">Admin Panel</h1>
					<p className="mt-2 text-sm">Sign in to access your dashboard</p>
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-6"
				>
					<FieldSet>
						<FieldGroup>
							<form.Field name="email">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel
												htmlFor={field.name}
												className="font-medium text-sm"
											>
												Email Address
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												type="email"
												placeholder="admin@efobi.dev"
												className="mt-1"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="password">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel
												htmlFor={field.name}
												className="font-medium text-sm"
											>
												Password
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												type="password"
												placeholder="••••••••"
												className="mt-1"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Subscribe>
								{(state) => (
									<Button
										type="submit"
										className="w-full"
										disabled={state.isSubmitting || isPending}
									>
										{state.isSubmitting ? "Signing in..." : "Sign In"}
									</Button>
								)}
							</form.Subscribe>
						</FieldGroup>
					</FieldSet>
				</form>
			</div>
		</div>
	);
}
