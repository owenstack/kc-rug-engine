import { useForm } from "@tanstack/react-form";
import { Check, LoaderCircle } from "lucide-react";
import { Fragment, useState } from "react";
import * as z from "zod";
import { useStepStore } from "@/lib/store";
import { Button, buttonVariants } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Field, FieldLabel } from "./ui/field";
import { ScrollArea } from "./ui/scroll-area";
import {
	Stepper,
	StepperContent,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperPanel,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "./ui/stepper";

type PlatformType = "pump.fun" | "raydium" | "jupiter" | "moonshot";
type CoinType = "standard" | "meme" | "utility" | "governance" | "nft";

const steps = [
	{ title: "Contract creation" },
	{ title: "Bundled wallets" },
	{ title: "Auto volume" },
];

export function NewCoinDialog({
	title = "+ Create New Coin",
	disabled = false,
}: {
	title?: string;
	disabled?: boolean;
}) {
	const { currentStep } = useStepStore();
	return (
		<Dialog>
			<DialogTrigger className={buttonVariants()} disabled={disabled}>
				{title}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Your Solana Token</DialogTitle>
					<Stepper
						defaultValue={1}
						indicators={{
							completed: <Check className="size-4" />,
							loading: <LoaderCircle className="size-4 animate-spin" />,
						}}
						className="space-y-8"
					>
						<StepperNav>
							{steps.map((step, index) => (
								<Fragment key={step.title}>
									<StepperItem step={index + 1}>
										<StepperTrigger className="flex flex-col gap-2">
											<StepperIndicator>{index + 1}</StepperIndicator>
											<StepperTitle>{step.title}</StepperTitle>
										</StepperTrigger>
									</StepperItem>
									{steps.length > index + 1 && (
										<StepperSeparator className="w-full" />
									)}
								</Fragment>
							))}
						</StepperNav>
						<StepperPanel className="text-sm">
							{steps.map((step, index) => (
								<StepperContent
									key={step.title}
									value={index + 1}
									className="flex items-center justify-center"
								>
									<ScrollArea>
										{currentStep === 1 && <CreateContractForm />}
									</ScrollArea>
								</StepperContent>
							))}
						</StepperPanel>
					</Stepper>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

function CreateContractForm() {
	const [platform, setPlatform] = useState<PlatformType>("pump.fun");
	const [coinType, setCoinType] = useState<CoinType>("standard");

	const formSchema = z.object({
		name: z.string().min(2, "Name must be at least 2 characters long"),
		ticker: z.string().min(2, "Ticker must be at least 2 characters long"),
		decimals: z.number().min(0).max(9),
		description: z.string().optional(),
		websiteUrl: z.string().optional(),
		twitterUrl: z.string().optional(),
		telegramUrl: z.string().optional(),
		marketCap: z.number().min(0).max(100_000),
		image: z.any().optional(),
		revoke: z.enum(["update", "freeze", "mint", "bundling"]).array().optional(),
		platform: z.enum(["pump.fun", "raydium", "jupiter", "moonshot"]),
		coinType: z.enum(["standard", "meme", "utility", "governance", "nft"]),
	});
	const { setCurrentStep } = useStepStore();
	const _form = useForm({
		defaultValues: {
			name: "",
			ticker: "",
			decimals: 0,
			description: "",
			websiteUrl: "",
			twitterUrl: "",
			telegramUrl: "",
			marketCap: 0,
			image: undefined,
			revoke: [],
			platform: platform,
			coinType: coinType,
		},
		validators: {
			// @ts-expect-error - TanStack Form Zod integration type mismatch
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			// Handle form submission logic here
			console.log("Form submitted:", value);
			// Move to the next step
			setCurrentStep(2);
		},
	});

	return (
		<div className="space-y-6 p-4">
			<Field>
				<FieldLabel>Select Launch Platform</FieldLabel>
				<div className="grid grid-cols-2 gap-2">
					{(
						["pump.fun", "raydium", "jupiter", "moonshot"] as PlatformType[]
					).map((p) => (
						<Button
							key={p}
							type="button"
							variant={platform === p ? "default" : "outline"}
							onClick={() => setPlatform(p)}
							className="w-full capitalize"
						>
							{p}
						</Button>
					))}
				</div>
				<p className="mt-2 text-muted-foreground text-xs">
					Selected platform: <span className="font-medium">{platform}</span>
				</p>
			</Field>
			<Field>
				<FieldLabel>Select Coin Type</FieldLabel>
				<div className="grid grid-cols-3 gap-2">
					{(
						["standard", "meme", "utility", "governance", "nft"] as CoinType[]
					).map((type) => (
						<Button
							key={type}
							type="button"
							variant={coinType === type ? "default" : "outline"}
							onClick={() => setCoinType(type)}
							className="w-full capitalize"
						>
							{type}
						</Button>
					))}
				</div>
				<p className="mt-2 text-muted-foreground text-xs">
					Selected type: <span className="font-medium">{coinType}</span>
				</p>
			</Field>
			<p className="text-center text-muted-foreground text-sm">
				Form fields coming soon...
			</p>
		</div>
	);
}
