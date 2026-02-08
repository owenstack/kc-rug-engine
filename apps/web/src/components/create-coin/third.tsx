import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";
import { useStepStore } from "@/lib/store";
import { orpc } from "@/utils/orpc";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export function CreateAutoVolumeForm() {
	const { setCurrentStep, coinId } = useStepStore();

	const formSchema = z.object({
		coinId: z.string(),
		volume: z.number().min(0, "Volume must be at least 0"),
		minBuyAmount: z.number().min(0, "Min buy amount must be at least 0"),
		maxBuyAmount: z.number().min(0, "Max buy amount must be at least 0"),
		slippage: z.number().min(0).max(1, "Slippage must be between 0 and 1"),
		delay: z.number().min(0, "Delay must be at least 0"),
	});
	const { mutateAsync } = useMutation(
		orpc.coin.createAutoVolume.mutationOptions(),
	);
	const form = useForm({
		defaultValues: {
			coinId,
			volume: 0,
			minBuyAmount: 0,
			maxBuyAmount: 0,
			slippage: 0,
			delay: 0,
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			toast.promise(mutateAsync(value), {
				loading: "Creating auto volume configuration...",
				success: () => {
					setCurrentStep(4);
					return "Auto volume configuration created successfully!";
				},
				error: "Failed to create auto volume configuration.",
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
				<form.Field name="volume">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Allocated Amount (SOL)</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									placeholder="Enter allocated amount"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="minBuyAmount">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Min Buy Amount (SOL)</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									placeholder="Enter min buy amount"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="maxBuyAmount">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Max Buy Amount (SOL)</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									placeholder="Enter max buy amount"
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
								<FieldLabel>Slippage (0 - 1)</FieldLabel>
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
				<form.Field name="delay">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Delay (in seconds)</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									placeholder="Enter delay in seconds"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Subscribe>
					{(state) => (
						<Button disabled={state.isSubmitting}>
							{state.isSubmitting ? "Creating..." : "Create token"}
						</Button>
					)}
				</form.Subscribe>
			</FieldGroup>
		</form>
	);
}
