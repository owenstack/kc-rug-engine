import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Coins, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import { NewCoinDialog } from "@/components/new";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/helpers";
import { useSolanaPrice } from "@/lib/queries";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { data: user } = useQuery({
		...orpc.user.getCurrentUser.queryOptions(),
		retry: false,
	});

	const handleProtectedAction = (action: () => void) => {
		if (!user) {
			toast.error("Sign in required", {
				action: {
					label: "Sign In",
					onClick: () => navigate({ to: "/login" }),
				},
			});
			return;
		}
		action();
	};

	return (
		<main className="container mx-auto mt-10 max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
			<div className="mt-4 flex items-center justify-between">
				<div>
					<h1 className="mb-1 font-semibold text-3xl">Dashboard</h1>
					<p className="text-muted-foreground">Manage your funds.</p>
				</div>
				<button
					type="button"
					onClick={() =>
						handleProtectedAction(() => toast.info("Coming soon!"))
					}
				>
					<NewCoinDialog disabled={!user} />
				</button>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="flex items-center justify-between px-4">
						<Wallet />
						<div className="flex gap-1">
							<Button
								size={"sm"}
								variant={"outline"}
								onClick={() =>
									handleProtectedAction(() => toast.info("Coming soon!"))
								}
							>
								Withdraw
							</Button>
							<Button
								size={"sm"}
								onClick={() =>
									handleProtectedAction(() => toast.info("Coming soon!"))
								}
							>
								Deposit
							</Button>
						</div>
					</CardContent>
					<CardHeader>
						<p>Fund wallet</p>
						<CardTitle>{formatCurrency(0 * useSolanaPrice())}</CardTitle>
						<CardDescription className="text-muted-foreground text-sm">
							1 SOL (1 SOL = {formatCurrency(useSolanaPrice())})
						</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between gap-2">
						<Coins className="size-4" />
					</CardContent>
					<CardHeader>
						<p>Coins</p>
						<CardTitle>0</CardTitle>
						<CardDescription className="text-muted-foreground text-sm">
							Displayed
						</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between gap-2">
						<TrendingUp className="size-4" />
					</CardContent>
					<CardHeader>
						<p>Total Earned</p>
						<CardTitle>$0</CardTitle>
						<CardDescription className="text-muted-foreground text-sm">
							0.000 SOL (1 SOL = {formatCurrency(useSolanaPrice())})
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="mb-1 font-semibold text-2xl">Your Coins</h2>
						<p>Manage and monitor your deployed coins.</p>
					</div>
					<div className="flex items-center gap-2">
						<Input
							placeholder="Search coins..."
							readOnly
							onClick={() =>
								handleProtectedAction(() => toast.info("Coming soon!"))
							}
						/>
						<Button
							variant={"secondary"}
							onClick={() =>
								handleProtectedAction(() => toast.info("Coming soon!"))
							}
						>
							All
						</Button>
					</div>
				</div>
				<Card className="w-full">
					<Empty>
						<EmptyHeader>
							<EmptyTitle>No coins found</EmptyTitle>
							<EmptyDescription>
								You haven't created any coins yet.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<NewCoinDialog title="Create Your First Coin" disabled={!user} />
						</EmptyContent>
					</Empty>
				</Card>
			</div>
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="mb-1 font-semibold text-2xl">Boost Your Coins</h2>
						<p>
							Increase your coin's visbility and market impact with strategic
							boosts
						</p>
					</div>
				</div>
				<Card className="w-full">
					<Empty>
						<EmptyHeader>
							<EmptyTitle>No coins found</EmptyTitle>
							<EmptyDescription>
								You don't have any active coins.
							</EmptyDescription>
						</EmptyHeader>
						<button
							type="button"
							onClick={() =>
								handleProtectedAction(() => toast.info("Coming soon!"))
							}
							className="w-full"
						>
							<EmptyContent>
								<NewCoinDialog
									title="Create Your First Coin"
									disabled={!user}
								/>
							</EmptyContent>
						</button>
					</Empty>
				</Card>
			</div>
		</main>
	);
}
