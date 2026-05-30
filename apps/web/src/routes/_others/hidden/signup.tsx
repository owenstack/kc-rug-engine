import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_others/hidden/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	const { mutateAsync, isPending } = useMutation(
		orpc.admin.signup.mutationOptions(),
	);
	const navigate = useNavigate();
	const schema = z.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
	});

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		validators: {
			onSubmit: schema,
		},
		onSubmit: async ({ value }) => {
			toast.promise(
				mutateAsync({
					name: value.name,
					email: value.email,
					password: value.password,
				}),
				{
					loading: "Creating account...",
					success: (res) => {
						if (res.user) {
							navigate({ to: "/dashboard" });
							return "Account created successfully";
						}
					},
					error: (err) => `Failed to sign up: ${(err as Error).message}`,
				},
			);
		},
	});

	return (
		<div className="flex h-screen w-full items-center justify-center px-4">
			<Card className="mx-auto w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Create Account</CardTitle>
					<CardDescription>
						Enter your details below to create your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-4"
					>
						<FieldSet>
							<FieldGroup>
								<form.Field name="name">
									{(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Name</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="John Doe"
													type="text"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="email">
									{(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Email</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="john@example.com"
													type="email"
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
												<FieldLabel htmlFor={field.name}>Password</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="••••••••"
													type="password"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								</form.Field>
							</FieldGroup>
						</FieldSet>
						<Button type="submit" disabled={isPending} className="w-full">
							{isPending ? "Creating account..." : "Sign Up"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
