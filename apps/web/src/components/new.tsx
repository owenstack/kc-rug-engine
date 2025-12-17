import { useForm } from "@tanstack/react-form";
import { Check, LoaderCircle } from "lucide-react";
import { Fragment } from "react";
import * as z from "zod";
import { useStepStore } from "@/lib/store";
import { buttonVariants } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
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

const steps = [
	{ title: "Contract creation" },
	{ title: "Bundled wallets" },
	{ title: "Auto volume" },
];

export function NewCoinDialog({ title = "+ Create New Coin" }) {
	const { currentStep } = useStepStore();
	return (
		<Dialog>
			<DialogTrigger className={buttonVariants()}>{title}</DialogTrigger>
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
	const formSchema = z.object({
		name: z.string().min(2, "Name must be at least 2 characters long"),
		ticker: z.string().min(2, "Ticker must be at least 2 characters long"),
		decimals: z.number().min(0).max(9),
		description: z.string().optional(),
		websiteUrl: z.url().optional(),
		twitterUrl: z.url().optional(),
		telegramUrl: z.url().optional(),
		marketCap: z.number().min(0).max(100_000),
		image: z.instanceof(File).optional(),
		revoke: z.enum(["update", "freeze", "mint", "bundling"]).array().optional(),
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
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			// Handle form submission logic here
			console.log("Form submitted:", value);
			// Move to the next step
			setCurrentStep(2);
		},
	});
}
