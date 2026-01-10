import type { AppRouterClient } from "@kc-rugengine/api/routers/index";
import { createORPCClient, ORPCError } from "@orpc/client";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { link, type orpc } from "@/utils/orpc";
import "../index.css";

export interface RouterAppContext {
	orpc: typeof orpc;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	errorComponent: ({ error }) => {
		const navigate = useNavigate();

		// Handle 401 Unauthorized errors by redirecting to login
		if (error instanceof ORPCError) {
			if (error.message === "Unauthorized" || error.code === "UNAUTHORIZED") {
				// Use useEffect-like pattern with setTimeout to handle navigation
				setTimeout(() => {
					navigate({ to: "/login" });
				}, 0);
				return null;
			}
		}

		// Determine status code and title
		let statusCode = 500;
		let title = "Internal Server Error";

		if (error instanceof ORPCError) {
			if (error.code === "FORBIDDEN") {
				statusCode = 403;
				title = "Forbidden";
			} else if (error.code === "NOT_FOUND") {
				statusCode = 404;
				title = "Not Found";
			} else if (error.code === "BAD_REQUEST") {
				statusCode = 400;
				title = "Bad Request";
			}
		}

		return (
			<ErrorBoundary error={error} statusCode={statusCode} title={title} />
		);
	},
	head: () => ({
		meta: [
			{
				title: "RugPull Engine",
			},
			{
				name: "description",
				content: "RugPull Engine is a web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
});

function RootComponent() {
	const [client] = useState<AppRouterClient>(() => createORPCClient(link));
	const [_orpcUtils] = useState(() => createTanstackQueryUtils(client));

	return (
		<>
			<HeadContent />
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				disableTransitionOnChange
				storageKey="vite-ui-theme"
			>
				<div className="grid h-svh grid-rows-[auto_1fr]">
					<Header />
					<Outlet />
				</div>
				<Toaster richColors />
			</ThemeProvider>
			<TanStackRouterDevtools position="bottom-left" />
			<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
		</>
	);
}
