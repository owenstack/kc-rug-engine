import { Check, LoaderCircle } from "lucide-react";
import { Fragment } from "react";
import { useStepStore } from "@/lib/store";
import { CreateContractForm } from "./create-coin/first";
import { CreateWalletsForm } from "./create-coin/second";
import { CreateAutoVolumeForm } from "./create-coin/third";
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

export function NewCoinDialog({
	title = "+ Create New Coin",
	disabled = false,
}: {
	title?: string;
	disabled?: boolean;
}) {
	const { currentStep } = useStepStore();
	return (
		<Dialog open={currentStep > 3}>
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
										{currentStep === 2 && <CreateWalletsForm />}
										{currentStep === 3 && <CreateAutoVolumeForm />}
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
