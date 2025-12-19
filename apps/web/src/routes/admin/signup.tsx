import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/admin/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	const { mutateAsync } = useMutation(orpc.admin.signup.mutationOptions());

	const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const name = form.get("name") as string;
		const email = form.get("email") as string;
		const password = form.get("password") as string;
		toast.promise(mutateAsync({ name, email, password }), {
			loading: "Creating account...",
			success: "Account created successfully",
			error: (err) => (err as Error).message,
		});
	};

	return (
		<div className="flex h-screen w-full flex-col items-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Admin Sign up</CardTitle>
					<CardDescription>Sign up as an admin</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input name="name" autoComplete="name" />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email address</Label>
							<Input type="email" name="email" />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input name="password" type="password" />
						</div>
						<Button type="submit">Submit</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
