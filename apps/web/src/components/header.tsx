import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/dashboard", label: "Dashboard" },
	] as const;

	return (
		<div className="fixed top-0 right-0 left-0 z-10 flex w-full items-center justify-between border border-b px-2 py-1 backdrop-blur-md">
			<div />
			<nav className="flex gap-4 text-lg">
				{links.map(({ to, label }) => {
					return (
						<Link key={to} to={to}>
							{label}
						</Link>
					);
				})}
			</nav>
			<div className="flex items-center gap-2">
				<ModeToggle />
				<UserMenu />
			</div>
		</div>
	);
}
