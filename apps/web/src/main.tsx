import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import ReactDOM from "react-dom/client";
import type { RegisterSWOptions } from "vite-plugin-pwa/types";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";
import { orpc, queryClient } from "./utils/orpc";

const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	defaultPendingComponent: () => <Loader />,
	context: { orpc, queryClient },
	Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

declare module "virtual:pwa-register/react" {
	export function useRegisterSW(options?: RegisterSWOptions): {
		needRefresh: [boolean, Dispatch<SetStateAction<boolean>>];
		offlineReady: [boolean, Dispatch<SetStateAction<boolean>>];
		updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
	};
}

const rootElement = document.getElementById("app");

if (!rootElement) {
	throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(<RouterProvider router={router} />);
}
