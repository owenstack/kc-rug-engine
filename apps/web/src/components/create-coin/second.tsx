import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";
import { useStepStore } from "@/lib/store";
import { orpc } from "@/utils/orpc";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export function CreateWalletsForm() {
	const { setCurrentStep, coinId } = useStepStore();
	const { mutateAsync } = useMutation(
		orpc.coin.createWallets.mutationOptions(),
	);
	const formSchema = z.object({
		devBuyAmount: z.number().min(0, "Dev buy amount must be at least 0"),
		bundledByAmount: z.number().min(0, "Bundled by amount must be at least 0"),
		bundledWalletAmount: z
			.number()
			.min(1, "Bundled wallet amount must be at least 1")
			.max(24, "Bundled wallet amount cannot exceed 24"),
		slippage: z.number().min(0).max(1, "Slippage must be between 0 and 1"),
		bundledLaunchType: z.string().min(1, "Bundled launch type is required"),
		coinId: z.string(),
	});

	const launchTypeOptions = [
		{ label: "Safe mode", value: "safe" },
		{ label: "Instant launch", value: "instant" },
		{ label: "Delayed launch", value: "delayed" },
	];

	const form = useForm({
		defaultValues: {
			devBuyAmount: 0,
			bundledByAmount: 0,
			bundledWalletAmount: 1,
			slippage: 0,
			bundledLaunchType: "safe",
			coinId,
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			toast.promise(mutateAsync(value), {
				loading: "Creating bundled wallets...",
				success: () => {
					setCurrentStep(3);
					return "Bundled wallets created successfully!";
				},
				error: "Failed to create bundled wallets.",
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field name="devBuyAmount">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Dev Buy Amount (SOL)</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									placeholder="Enter dev buy amount"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="bundledByAmount">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Bundled Buy Amount (SOL)</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									placeholder="Enter bundled buy amount (SOL)"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="bundledWalletAmount">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Bundled Wallet Amount (max 24)</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									placeholder="Enter bundled wallet amount"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="slippage">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Slippage (0-1)</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									placeholder="Enter slippage"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="bundledLaunchType">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Bundled Launch Type</FieldLabel>
								<Select
									name={field.name}
									value={field.state.value}
									onValueChange={field.handleChange}
								>
									<SelectTrigger aria-invalid={isInvalid}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{launchTypeOptions.map((opt) => (
											<SelectItem key={opt.value} value={opt.value}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Subscribe>
					{(state) => (
						<Button disabled={state.isSubmitting}>
							{state.isSubmitting ? "Submitting..." : "Submit"}
						</Button>
					)}
				</form.Subscribe>
			</FieldGroup>
		</form>
	);
}
