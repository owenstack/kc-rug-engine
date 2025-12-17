import prisma from "@kc-rugengine/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { admin, apiKey } from "better-auth/plugins";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path !== "/sign-up/email" && ctx.path !== "/sign-in/email") {
				return;
			}
			if (!ctx.body?.email.endsWith("@efobi.dev")) {
				throw new APIError("BAD_REQUEST", {
					message: "Email domain not allowed",
				});
			}
		}),
	},
	plugins: [apiKey(), admin()],
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
});
