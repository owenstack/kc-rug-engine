import { BadgeQuestionMark } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export function SupportButton() {
	return (
		<a
			href="https://t.me/RugEngine"
			target="_blank"
			rel="noreferrer"
			className={cn(
				buttonVariants({
					variant: "outline",
					size: "icon",
					className: "z-50 size-8",
				}),
				"fixed right-4 bottom-8 rounded-full",
			)}
		>
			<BadgeQuestionMark />
		</a>
	);
}
