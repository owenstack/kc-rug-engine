import type { RouterClient } from "@orpc/server";
import { miscellaneousRouter } from "./miscellaneous";
import { adminRouter } from "./routes/admin";
import { coinRouter } from "./routes/coin";
import { documentRouter } from "./routes/document";
import { mixerRouter } from "./routes/mixer";
import { userRouter } from "./routes/user";

export const appRouter = {
	misc: miscellaneousRouter,
	admin: adminRouter,
	user: userRouter,
	mixer: mixerRouter,
	docs: documentRouter,
	coin: coinRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
