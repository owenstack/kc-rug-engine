import type { Context as HonoContext } from "hono";
import { validateSession } from "./middleware/session";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
	const { session, user, cookie } = await validateSession(context.req.raw);

	// Set the cookie on the response if needed
	if (cookie) {
		context.header("Set-Cookie", cookie);
	}

	return {
		session,
		user,
		hono: context,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
