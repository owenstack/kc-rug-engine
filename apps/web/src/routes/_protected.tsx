import { createFileRoute, Outlet } from "@tanstack/react-router";
import { client } from "@/utils/orpc";

export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
	beforeLoad: async () => {
		try {
			const user = await client.user.getCurrentUser();
			return { user };
		} catch (_e) {
			return { user: null };
		}
	},
});

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
