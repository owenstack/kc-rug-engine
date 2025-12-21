import { createFileRoute, redirect } from "@tanstack/react-router";
import { CreateUserDialog } from "@/components/admin/new-user";
import ImageGen from "@/components/image-gen";
import { client } from "@/utils/orpc";

export const Route = createFileRoute("/admin/")({
	component: RouteComponent,
	beforeLoad: async () => {
		const user = await client.user.getCurrentUser();
		if (!user) {
			redirect({
				to: "/admin/login",
				throw: true,
			});
			return { user: null };
		}
		if (user.role !== "admin") {
			redirect({
				to: "/dashboard",
				throw: true,
			});
		}
		const { data } = await client.admin.listUsers({ query: {} });
		const totalUsers = data?.total;
		return { user, totalUsers };
	},
});

function RouteComponent() {
	const { user, totalUsers } = Route.useRouteContext();
	return (
		<main className="container mx-auto mt-10 max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
			<div className="mt-4">
				<h1 className="mb-1 font-semibold text-3xl">
					Welcome, {user?.name.split(" ")[0]}
				</h1>
				<p className="text-muted-foreground">Manage the application.</p>
			</div>
			<div>
				<div className="flex items-center justify-between">
					<p>There are {totalUsers} active users.</p>
					<CreateUserDialog />
				</div>
				<ImageGen />
			</div>
		</main>
	);
}
