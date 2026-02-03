import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
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

export const Route = createFileRoute("/_others/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const { mutateAsync, isPending } = useMutation(
		orpc.user.loginWithApiKey.mutationOptions(),
	);
	const navigate = useNavigate();
	const schema = z.object({
		apiKey: z.string().min(1, "API Key is required"),
	});

	const form = useForm({
		defaultValues: {
			apiKey: "",
		},
		validators: {
			onSubmit: schema,
		},
		onSubmit: async ({ value }) => {
			toast.promise(
				mutateAsync({
					apiKey: value.apiKey,
				}),
				{
					loading: "Signing in...",
					success: (res) => {
						if (res.user) {
							navigate({ to: "/dashboard" });
							return "Signed in successfully";
						}
					},
					error: (err) => `Failed to sign in: ${(err as Error).message}`,
				},
			);
		},
	});

	return (
		<div className="flex h-screen w-full items-center justify-center px-4">
			<Card className="mx-auto w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Login with API Key</CardTitle>
					<CardDescription>
						Enter your restricted API key to access the dashboard.
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
								<form.Field name="apiKey">
									{(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>API Key</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="RUGPULLENGINE_..."
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
							{isPending ? "Logging in..." : "Login"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
