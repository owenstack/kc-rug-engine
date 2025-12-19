import { useForm } from "@tanstack/react-form";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useCopyToClipboard } from "@/hooks/clipboard";
import { client, queryClient } from "@/utils/orpc";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const timeUnits = [
	{ label: "1 month", value: "30d", number: 60 * 60 * 24 * 30 },
	{ label: "3 months", value: "90d", number: 60 * 60 * 24 * 90 },
	{ label: "6 months", value: "180d", number: 60 * 60 * 24 * 180 },
	{ label: "12 months", value: "365d", number: 60 * 60 * 24 * 365 },
] as const;

export function CreateUserDialog() {
	const [open, setOpen] = useState(false);
	const { copyToClipboard } = useCopyToClipboard();

	const schema = z.object({
		name: z.string().min(2).max(100),
		expiresIn: z.string().min(1),
	});

	const form = useForm({
		defaultValues: {
			name: "",
			expiresIn: "30d",
		},
		validators: {
			onSubmit: schema,
		},
		onSubmit: async ({ value }) => {
			toast.promise(
				client.admin.createRestrictedUser({
					name: value.name,
					expiresIn: timeUnits.find((tu) => tu.value === value.expiresIn)
						?.number,
				}),
				{
					loading: "Creating User & API key...",
					success: (res) => {
						copyToClipboard(res.apiKey);
						setOpen(false);
						queryClient.invalidateQueries();
						return `Created user ${res.user.name}. API Key copied to clipboard!`;
					},
					error: "Failed to create API key",
				},
			);
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusIcon className="mr-2 size-4" />
					New user
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Restricted User</DialogTitle>
					<DialogDescription>
						Create a new user with an API key. The key will be copied to your
						clipboard automatically.
					</DialogDescription>
				</DialogHeader>
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
												placeholder="User Name"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="expiresIn">
								{(field) => (
									<Field>
										<FieldLabel>Expiration</FieldLabel>
										<Select
											value={field.state.value}
											onValueChange={(val) => field.handleChange(val)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select expiration" />
											</SelectTrigger>
											<SelectContent>
												{timeUnits.map((unit) => (
													<SelectItem key={unit.value} value={unit.value}>
														{unit.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							</form.Field>
						</FieldGroup>
					</FieldSet>
					<DialogFooter>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button type="submit" disabled={!canSubmit || isSubmitting}>
									{isSubmitting ? "Creating..." : "Create User"}
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
