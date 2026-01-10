import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function Header() {
	const links: Array<{ to: `/${string}`; label: string }> = [
		{ to: "/", label: "Home" },
		{ to: "/dashboard", label: "Dashboard" },
		{ to: "/pricing", label: "Pricing" },
	] as const;
	const navigate = useNavigate();
	const { data: user, isLoading } = useQuery(
		orpc.user.getCurrentUser.queryOptions(),
	);
	const { mutateAsync, isPending } = useMutation({
		...orpc.user.logout.mutationOptions(),
		retry: false,
	});

	return (
		<div className="fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-between border border-b px-2 py-1 backdrop-blur-md">
			<div />
			<nav className="flex gap-4 text-lg">
				{links.map(({ to, label }) => {
					return (
						<Link key={to} to={to as string}>
							{label}
						</Link>
					);
				})}
			</nav>
			{isLoading ? (
				<Skeleton className="h-9 w-24" />
			) : user ? (
				<Button
					variant={"ghost"}
					onClick={async () => {
						await mutateAsync({});
						navigate({ to: "/login" });
					}}
				>
					{isPending ? "Logging out..." : "Log out"}
				</Button>
			) : (
				<Link to="/login">Sign in</Link>
			)}
		</div>
	);
}
