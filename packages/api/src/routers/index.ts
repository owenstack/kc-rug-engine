import type { RouterClient } from "@orpc/server";
import { miscellaneousRouter } from "./miscellaneous";
import { adminRouter } from "./routes/admin";
import { userRouter } from "./routes/user";

export const appRouter = {
	misc: miscellaneousRouter,
	admin: adminRouter,
	user: userRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
