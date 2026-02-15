import { createFileRoute, Outlet } from "@tanstack/react-router";
import { client } from "@/utils/orpc";

export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
	beforeLoad: async () => {
		const user = await client.user.getCurrentUser();
		return { user };
	},
});

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
