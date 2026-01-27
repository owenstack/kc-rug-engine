import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

// Interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PWAInstallPrompt() {
	const [isOpen, setIsOpen] = useState(false);
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);

	useEffect(() => {
		const handler = (e: Event) => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault();
			// Stash the event so it can be triggered later.
			setDeferredPrompt(e as BeforeInstallPromptEvent);
			// Update UI notify the user they can install the PWA
			setIsOpen(true);
		};

		window.addEventListener("beforeinstallprompt", handler);

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) return;

		// Show the install prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;
		
		if (outcome === "accepted") {
			setDeferredPrompt(null);
		}
		
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Install App</DialogTitle>
					<DialogDescription>
						Install our app on your device for a better experience, offline access, and easier access.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:justify-start">
					<Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
						Maybe later
					</Button>
					<Button type="button" onClick={handleInstall}>
						Install
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
