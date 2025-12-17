import type { RouterClient } from "@orpc/server";
import { miscellaneousRouter } from "./miscellaneous";
import { adminAuthRouter } from "./routes/admin-auth";
import { customAuthRouter } from "./routes/custom-auth";

export const appRouter = {
	misc: miscellaneousRouter,
	adminAuth: adminAuthRouter,
	customAuth: customAuthRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
