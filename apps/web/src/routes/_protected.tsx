import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { client } from "@/utils/orpc";

export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
	beforeLoad: async () => {
		const user = await client.user.getCurrentUser();
		if (!user) {
			return redirect({
				to: "/login",
				throw: true,
			});
		}
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
