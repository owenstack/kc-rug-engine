import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCryptoPrices } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";
import {
	Field,
	FieldGroup,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";

export const Route = createFileRoute("/_others/mixer")({
	component: RouteComponent,
});

type MixingStep = "input" | "processing" | "complete";
type CryptoType = "BTC" | "ETH" | "XMR" | "LTC" | "USDT";

interface MixingProgress {
	status: string;
	progress: number;
}

function RouteComponent() {
	const [step, setStep] = useState<MixingStep>("input");
	const [crypto, setCrypto] = useState<CryptoType>("BTC");
	const [mixingProgress, setMixingProgress] = useState<MixingProgress[]>([]);

	const { prices, isLoading: pricesLoading } = useCryptoPrices();
	const { mutateAsync: createTransaction } = useMutation(
		orpc.mixer.createMixerTransaction.mutationOptions(),
	);

	const fees = {
		BTC: "0.5-3%",
		ETH: "0.5-2.5%",
		XMR: "0.3-2%",
		LTC: "0.5-2%",
		USDT: "1-3%",
	};

	const schema = z.object({
		amount: z.string().min(1, "Amount is required"),
		destinationAddresses: z
			.array(z.string().min(1, "Address is required"))
			.min(1)
			.max(5),
		delayHours: z.string().min(1, "Delay is required"),
	});

	const form = useForm({
		defaultValues: {
			amount: "",
			destinationAddresses: [""],
			delayHours: "2",
		},
		validators: {
			onSubmit: schema,
		},
		onSubmit: async ({ value }) => {
			try {
				const result = await createTransaction({
					cryptocurrency: crypto,
					amount: value.amount,
					destinationAddresses: value.destinationAddresses,
					delayHours: Number.parseInt(value.delayHours, 10),
				});

				if (result.success && result.transaction) {
					setStep("processing");
					toast.success("Transaction created successfully!");

					// Simulate mixing progress
					simulateMixing();
				}
			} catch (error) {
				toast.error(
					`Failed to create transaction: ${(error as Error).message}`,
				);
			}
		},
	});

	const simulateMixing = () => {
		const steps = [
			"Waiting for deposit confirmation...",
			"Deposit confirmed (1/3 confirmations)",
			"Deposit confirmed (2/3 confirmations)",
			"Deposit confirmed (3/3 confirmations)",
			"Splitting transaction into random chunks...",
			"Mixing with pool transactions...",
			"Applying time delays...",
			"Routing through multiple nodes...",
			"Preparing output transactions...",
			"Sending to destination addresses...",
		];

		let currentStep = 0;
		const interval = setInterval(() => {
			if (currentStep < steps.length) {
				setMixingProgress((prev) => [
					...prev,
					{
						status: steps[currentStep],
						progress: ((currentStep + 1) / steps.length) * 100,
					},
				]);
				currentStep++;
			} else {
				clearInterval(interval);
				setTimeout(() => setStep("complete"), 1000);
			}
		}, 2000);
	};

	const resetMixer = () => {
		setStep("input");
		form.reset();
		setMixingProgress([]);
	};

	const currentPrice = prices?.[crypto]?.price || 0;
	const usdValue =
		currentPrice * (Number.parseFloat(form.state.values.amount) || 0);

	return (
		<div className="container mx-auto min-h-screen px-4 py-8">
			<div className="mx-auto max-w-4xl space-y-6">
				{/* Header */}
				<div className="space-y-2 text-center">
					<h1 className="font-bold text-4xl tracking-tight">CryptoMix</h1>
					<p className="text-muted-foreground">
						Anonymous cryptocurrency mixing service - Protect your financial
						privacy
					</p>
				</div>

				{/* Privacy Features Banner */}
				<Card className="border-primary/20 bg-primary/5">
					<CardContent className="pt-6">
						<div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
							<div className="space-y-1">
								<div className="font-bold text-2xl text-primary">🔒</div>
								<div className="font-semibold text-sm">No Logs Policy</div>
								<div className="text-muted-foreground text-xs">
									All data deleted after 24h
								</div>
							</div>
							<div className="space-y-1">
								<div className="font-bold text-2xl text-primary">⚡</div>
								<div className="font-semibold text-sm">Instant Mixing</div>
								<div className="text-muted-foreground text-xs">
									Average time: 2-6 hours
								</div>
							</div>
							<div className="space-y-1">
								<div className="font-bold text-2xl text-primary">🌐</div>
								<div className="font-semibold text-sm">Multi-Chain</div>
								<div className="text-muted-foreground text-xs">
									Support for 5+ cryptocurrencies
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{step === "input" && (
					<Card>
						<CardHeader>
							<CardTitle>Mix Your Cryptocurrency</CardTitle>
							<CardDescription>
								Break the connection between your addresses for maximum privacy
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}}
							>
								<FieldGroup>
									<Field>
										<FieldLabel>Select cryptocurrency</FieldLabel>
										<div className="grid grid-cols-5 gap-2">
											{(
												["BTC", "ETH", "XMR", "LTC", "USDT"] as CryptoType[]
											).map((c) => (
												<Button
													key={c}
													type="button"
													variant={crypto === c ? "default" : "outline"}
													onClick={() => setCrypto(c)}
													className="w-full"
												>
													{c}
												</Button>
											))}
										</div>
										{!pricesLoading && prices && (
											<div className="flex items-center justify-between text-xs">
												<span className="text-muted-foreground">
													Fee: {fees[crypto]} + Network fee
												</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">
														${prices[crypto]?.price.toLocaleString()}
													</span>
													<span
														className={cn(
															"font-medium",
															prices[crypto]?.change24h >= 0
																? "text-green-600"
																: "text-red-600",
														)}
													>
														{prices[crypto]?.change24h >= 0 ? "+" : ""}
														{prices[crypto]?.change24h.toFixed(2)}%
													</span>
												</div>
											</div>
										)}
									</Field>
									<form.Field name="amount">
										{(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel>Amount to Mix</FieldLabel>
													<Input
														type="number"
														step="any"
														placeholder="0.00"
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
													/>
													<FieldDescription>{crypto}</FieldDescription>
													{usdValue > 0 && (
														<p className="text-muted-foreground text-xs">
															≈ $
															{usdValue.toLocaleString(undefined, {
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															})}{" "}
															USD
														</p>
													)}
													<p className="text-muted-foreground text-xs">
														Minimum:{" "}
														{crypto === "BTC"
															? "0.001"
															: crypto === "ETH"
																? "0.01"
																: "0.1"}{" "}
														{crypto}
													</p>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									</form.Field>
									<form.Field name="destinationAddresses">
										{(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel>Destination addresses</FieldLabel>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => {
															if (field.state.value.length < 5) {
																field.pushValue("");
															}
														}}
														disabled={field.state.value.length >= 5}
													>
														+ Add Address
													</Button>
													<div className="space-y-2">
														{field.state.value.map((_, index) => (
															<form.Field
																// biome-ignore lint/suspicious/noArrayIndexKey: index used for form field iteration
																key={index}
																name={`destinationAddresses[${index}]`}
															>
																{(subField) => (
																	<div className="flex gap-2">
																		<Input
																			placeholder={`${crypto} address ${index + 1}`}
																			value={subField.state.value || ""}
																			onChange={(e) =>
																				subField.handleChange(e.target.value)
																			}
																			onBlur={subField.handleBlur}
																			className="flex-1"
																		/>
																		{field.state.value.length > 1 && (
																			<Button
																				type="button"
																				variant="outline"
																				size="icon"
																				onClick={() => field.removeValue(index)}
																			>
																				×
																			</Button>
																		)}
																	</div>
																)}
															</form.Field>
														))}
													</div>
													<FieldDescription>
														Split your funds across multiple addresses for
														better anonymity (max 5)
													</FieldDescription>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									</form.Field>
									<form.Field name="delayHours">
										{(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel>Time Delay (hours)</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														type="number"
														min={1}
														max={72}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
													/>
													<FieldDescription>
														Random delays between output transactions (1-72
														hours)
													</FieldDescription>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									</form.Field>
									<div className="space-y-2 rounded-md bg-muted p-4">
										<div className="flex items-center gap-2">
											<div className="h-2 w-2 rounded-full bg-green-500" />
											<span className="font-semibold text-sm">
												Letter of Guarantee
											</span>
										</div>
										<p className="text-muted-foreground text-xs">
											A cryptographically signed guarantee will be provided upon
											deposit. This serves as proof of our commitment to
											complete your transaction.
										</p>
									</div>
									<form.Subscribe>
										{(state) => (
											<Button disabled={state.isSubmitting}>
												{state.isSubmitting
													? "Creating transaction..."
													: "Start Mixing Process"}
											</Button>
										)}
									</form.Subscribe>
									<p className="text-center text-muted-foreground text-xs">
										By proceeding, you agree to our Terms of Service and Privacy
										Policy
									</p>
								</FieldGroup>
							</form>
						</CardContent>
					</Card>
				)}

				{step === "processing" && (
					<Card>
						<CardHeader>
							<CardTitle>Mixing in Progress</CardTitle>
							<CardDescription>
								Your transaction is being processed through our mixing pool
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Deposit Address */}
							<div className="space-y-2 rounded-md border border-primary/20 bg-primary/5 p-4">
								<Label className="text-primary">
									Send exactly {form.state.values.amount} {crypto} to:
								</Label>
								<div className="flex gap-2">
									<Input
										value={
											crypto === "BTC"
												? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
												: crypto === "ETH"
													? "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
													: crypto === "XMR"
														? "4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx"
														: crypto === "LTC"
															? "ltc1qhsj5ha6vdxjzp7zz5zqz5qzqzqzqzqzqz"
															: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
										}
										readOnly
										className="font-mono text-xs"
									/>
									<Button
										variant="outline"
										onClick={() =>
											navigator.clipboard.writeText(
												crypto === "BTC"
													? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
													: crypto === "ETH"
														? "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
														: crypto === "XMR"
															? "4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx"
															: crypto === "LTC"
																? "ltc1qhsj5ha6vdxjzp7zz5zqz5qzqzqzqzqzqz"
																: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
											)
										}
									>
										Copy
									</Button>
								</div>
								<p className="text-muted-foreground text-xs">
									⚠️ Send only {crypto} to this address. Any other cryptocurrency
									will be lost.
								</p>
							</div>

							<Separator />

							{/* Mixing Progress */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label>Mixing Progress</Label>
									<span className="font-medium text-sm">
										{mixingProgress.length > 0
											? Math.round(
													mixingProgress[mixingProgress.length - 1].progress,
												)
											: 0}
										%
									</span>
								</div>

								{/* Progress Bar */}
								<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
									<div
										className="h-full bg-primary transition-all duration-500"
										style={{
											width: `${mixingProgress.length > 0 ? mixingProgress[mixingProgress.length - 1].progress : 0}%`,
										}}
									/>
								</div>

								{/* Progress Steps */}
								<div className="max-h-64 space-y-2 overflow-y-auto">
									{mixingProgress.map((progress, index) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <index used for iteration only>
											key={index}
											className={cn(
												"flex items-center gap-3 rounded-md p-2",
												index === mixingProgress.length - 1 && "bg-primary/10",
											)}
										>
											<div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
											<span className="text-sm">{progress.status}</span>
										</div>
									))}
								</div>
							</div>

							<p className="text-center text-muted-foreground text-xs">
								Do not close this page. Bookmark this URL to check status later.
							</p>
						</CardContent>
					</Card>
				)}

				{step === "complete" && (
					<Card className="border-green-500/20 bg-green-500/5">
						<CardHeader>
							<CardTitle className="text-green-600 dark:text-green-400">
								✓ Mixing Complete
							</CardTitle>
							<CardDescription>
								Your cryptocurrency has been successfully mixed and sent
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4 rounded-md bg-background p-6 text-center">
								<div className="text-6xl">🎉</div>
								<div className="space-y-2">
									<p className="font-semibold">
										Transaction Completed Successfully
									</p>
									<p className="text-muted-foreground text-sm">
										{form.state.values.amount} {crypto} has been mixed and
										distributed to your destination addresses
									</p>
								</div>
							</div>

							<div className="space-y-3">
								<Label>Output Transactions</Label>
								{form.state.values.destinationAddresses.map((addr, index) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: <index used for iteration only>
										key={index}
										className="flex items-center gap-2 rounded-md bg-muted p-3"
									>
										<div className="h-2 w-2 rounded-full bg-green-500" />
										<div className="flex-1 space-y-1">
											<div className="break-all font-mono text-xs">{addr}</div>
											<div className="text-muted-foreground text-xs">
												Amount: ~
												{(
													Number.parseFloat(form.state.values.amount) /
													form.state.values.destinationAddresses.length
												).toFixed(6)}{" "}
												{crypto}
											</div>
										</div>
									</div>
								))}
							</div>

							<div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4">
								<p className="font-medium text-sm">Important Security Notice</p>
								<p className="mt-1 text-muted-foreground text-xs">
									All transaction records have been permanently deleted from our
									servers. We recommend clearing your browser history and cache
									for complete privacy.
								</p>
							</div>

							<Button className="w-full" onClick={resetMixer}>
								Start New Mixing
							</Button>
						</CardContent>
					</Card>
				)}

				{/* How It Works Section */}
				<Card>
					<CardHeader>
						<CardTitle>How CryptoMix Works</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
							<div className="space-y-2">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
									1
								</div>
								<h3 className="font-semibold text-sm">Deposit</h3>
								<p className="text-muted-foreground text-xs">
									Send your crypto to our secure mixing address
								</p>
							</div>
							<div className="space-y-2">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
									2
								</div>
								<h3 className="font-semibold text-sm">Mix</h3>
								<p className="text-muted-foreground text-xs">
									Funds are split and mixed with other transactions
								</p>
							</div>
							<div className="space-y-2">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
									3
								</div>
								<h3 className="font-semibold text-sm">Delay</h3>
								<p className="text-muted-foreground text-xs">
									Random time delays make tracking impossible
								</p>
							</div>
							<div className="space-y-2">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
									4
								</div>
								<h3 className="font-semibold text-sm">Receive</h3>
								<p className="text-muted-foreground text-xs">
									Clean crypto sent to your destination addresses
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* FAQ Section */}
				<Card>
					<CardHeader>
						<CardTitle>Frequently Asked Questions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<h3 className="font-semibold text-sm">
								Is mixing cryptocurrency legal?
							</h3>
							<p className="text-muted-foreground text-xs">
								Cryptocurrency mixing for privacy purposes is legal in most
								jurisdictions. However, laws vary by country. Users are
								responsible for compliance with local regulations.
							</p>
						</div>
						<Separator />
						<div className="space-y-2">
							<h3 className="font-semibold text-sm">
								How long does mixing take?
							</h3>
							<p className="text-muted-foreground text-xs">
								Mixing typically takes 2-6 hours depending on network congestion
								and your selected time delay. Longer delays provide better
								anonymity.
							</p>
						</div>
						<Separator />
						<div className="space-y-2">
							<h3 className="font-semibold text-sm">
								What if I send the wrong amount?
							</h3>
							<p className="text-muted-foreground text-xs">
								Our system automatically detects the amount sent and processes
								it accordingly. However, we recommend sending the exact amount
								for the smoothest experience.
							</p>
						</div>
						<Separator />
						<div className="space-y-2">
							<h3 className="font-semibold text-sm">Do you keep any logs?</h3>
							<p className="text-muted-foreground text-xs">
								No. All transaction data is automatically deleted 24 hours after
								completion. We do not store IP addresses, browser fingerprints,
								or any identifying information.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
