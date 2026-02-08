import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";
import { useStepStore } from "@/lib/store";
import { orpc } from "@/utils/orpc";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import FileUploadCompact from "../ui/compact-upload";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";

export function CreateContractForm() {
	const { mutateAsync: uploadDocument, isPending } = useMutation(
		orpc.docs.uploadDocument.mutationOptions(),
	);
	const { mutateAsync } = useMutation(orpc.coin.createCoin.mutationOptions());
	const revokeOptions = [
		{ label: "Update authority", value: "update" },
		{ label: "Freeze authority", value: "freeze" },
		{ label: "Mint authority", value: "mint" },
		{ label: "Bundling authority", value: "bundling" },
	];

	const formSchema = z.object({
		name: z.string().min(2, "Name must be at least 2 characters long"),
		ticker: z.string().min(2, "Ticker must be at least 2 characters long"),
		decimals: z.number().min(0).max(9),
		description: z.string(),
		websiteUrl: z.url(),
		twitterUrl: z.url(),
		telegramUrl: z.url(),
		marketCap: z.number().min(0).max(100_000),
		image: z.url(),
		revoke: z
			.array(z.string())
			.min(1, "Please select at least one revoke option.")
			.refine(
				(value) =>
					value.every((item) =>
						revokeOptions.some((option) => option.value === item),
					),
				{ error: "Invalid revoke option selected." },
			),
	});
	const { setCurrentStep, setCoinId } = useStepStore();
	const form = useForm({
		defaultValues: {
			name: "",
			ticker: "",
			decimals: 0,
			description: "",
			websiteUrl: "",
			twitterUrl: "",
			telegramUrl: "",
			marketCap: 0,
			image: "",
			revoke: [] as string[],
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			toast.promise(mutateAsync(value), {
				loading: "Creating coin...",
				success: (res) => {
					setCoinId(res.coinId);
					setCurrentStep(2);
					return "Coin created successfully!";
				},
				error: "Failed to create coin.",
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
				<form.Field name="name">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Name</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Enter coin name"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="ticker">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Ticker</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Enter coin ticker"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="decimals">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Decimals</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									placeholder="Enter coin decimals"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="description">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Description</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Enter coin description"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="websiteUrl">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Website</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Enter website URL"
									type="url"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="telegramUrl">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Telegram</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Enter Telegram URL"
									type="url"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="marketCap">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Fake Market Cap (0 - 100,000)</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									placeholder="Enter amount ($)"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<Field>
					<FieldLabel>Driver's License (Front & Back)</FieldLabel>
					<FileUploadCompact
						maxFiles={1}
						onFilesChange={async (files) => {
							// We only care about new files that haven't been uploaded yet
							const image = files[0];
							if (image.file instanceof File) {
								toast.promise(uploadDocument({ file: image.file }), {
									loading: "Uploading image...",
									success: (res) => {
										form.setFieldValue("image", res.url);
										form.validateField("image", "change");
										return "Image uploaded successfully!";
									},
									error: "Failed to upload image.",
								});
							}
						}}
					/>
					{(() => {
						const isInvalid =
							(form.getFieldMeta("image")?.isTouched &&
								!form.getFieldMeta("image")?.isValid) ??
							false;
						return isInvalid ? (
							<FieldError
								errors={[...(form.getFieldMeta("image")?.errors ?? [])]}
							/>
						) : null;
					})()}
				</Field>
				<form.Field name="revoke" mode="array">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<FieldSet>
								<FieldLegend variant="label">Revoke options</FieldLegend>
								<FieldGroup data-slot="checkbox-group">
									{revokeOptions.map((option) => (
										<Field
											key={option.value}
											orientation={"horizontal"}
											data-invalid={isInvalid}
										>
											<Checkbox
												id={option.value}
												name={field.name}
												aria-invalid={isInvalid}
												checked={field.state.value.includes(option.value)}
												onCheckedChange={(checked) => {
													if (checked) {
														field.pushValue(option.value);
													} else {
														const index = field.state.value.indexOf(
															option.value,
														);
														if (index > -1) {
															field.removeValue(index);
														}
													}
												}}
											/>
											<FieldLabel htmlFor={option.value}>
												{option.label}
											</FieldLabel>
										</Field>
									))}
								</FieldGroup>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</FieldSet>
						);
					}}
				</form.Field>
				<form.Subscribe>
					{(state) => (
						<Button disabled={state.isSubmitting || isPending}>
							{state.isSubmitting ? "Submitting..." : "Submit"}
						</Button>
					)}
				</form.Subscribe>
			</FieldGroup>
		</form>
	);
}
