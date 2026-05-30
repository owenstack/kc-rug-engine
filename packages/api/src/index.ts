import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
	if (!context.user || !context.session) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({
		context: {
			session: context.session,
			user: context.user,
		},
	});
});

const requireAdmin = o.middleware(async ({ context, next }) => {
	if (!context.user || context.user.role !== "admin") {
		throw new ORPCError("FORBIDDEN");
	}
	return next({
		context: {
			session: context.session,
			user: context.user,
		},
	});
});

export const protectedProcedure = publicProcedure.use(requireAuth);
export const adminProcedure = publicProcedure.use(requireAdmin);
