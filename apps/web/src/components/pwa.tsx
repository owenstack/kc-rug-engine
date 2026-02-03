import { useRegisterSW } from "virtual:pwa-register/react";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const intervalMS = 60 * 60 * 1000; // 1 hour

export function PWAHandler() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const {
		offlineReady: [offlineReady, setOfflineReady],
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(r) {
			r &&
				setInterval(() => {
					r.update();
				}, intervalMS);
		},
		onRegisterError(error) {
			console.log("SW registration error", (error as Error).message);
		},
	});
	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
			setDialogOpen(true);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
		};
	}, []);

	if (offlineReady || needRefresh) {
		toast.info(
			needRefresh ? "New content available" : "App ready to work offline",
			{
				action: needRefresh
					? {
							label: "Reload",
							onClick: () => updateServiceWorker(true),
						}
					: undefined,
				duration: 10000,
				onDismiss: () => {
					setOfflineReady(false);
					setNeedRefresh(false);
				},
			},
		);
	}

	const handleInstall = async () => {
		if (!deferredPrompt) return;
		setDialogOpen(false);
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") {
			setDeferredPrompt(null);
		}
	};
	if (!deferredPrompt) return null;

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg"
				>
					<Download />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Install App</DialogTitle>
					<DialogDescription>
						Install our app on your device for a better experience, offline
						access, and easier access.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:justify-start">
					<Button
						type="button"
						variant="secondary"
						onClick={() => setDialogOpen(false)}
					>
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

// Interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}
