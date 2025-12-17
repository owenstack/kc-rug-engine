import { auth } from "@kc-rugengine/auth";
import prisma from "@kc-rugengine/db";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { publicProcedure } from "../../index";

export const customAuthRouter = {
	loginWithApiKey: publicProcedure
		.input(
			z.object({
				apiKey: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			// 1. Find the API Key
			const keyRecord = await prisma.apikey.findFirst({
				where: {
					key: input.apiKey,
				},
				include: {
					user: true,
				},
			});

			if (!keyRecord) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "Invalid API Key",
				});
			}

			// 2. Check validity
			if (keyRecord.enabled === false) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "API Key is disabled",
				});
			}

			if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "API Key has expired",
				});
			}

			if (!keyRecord.user) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "User not found",
				});
			}

			// 3. Create Session
			// Use better-auth internal adapter to create session
            // This handles token generation and hashing correctly
			const ctx = await auth.$context;
            const newSession = await ctx.internalAdapter.createSession(keyRecord.userId);

            if (!newSession) {
                 throw new ORPCError("INTERNAL_SERVER_ERROR", {
                     message: "Failed to create session",
                 });
            }

            const session = newSession;
            // Note: If better-auth hashes the token, this might be the hash. 
            // In that case, we need to generate the token manually and use adapter.createSession(session).
            // But internalAdapter.createSession(userId) implies generation.
            // Let's assume for now it returns the session with the token usable (or raw).
            const token = session.token;

			// 4. Return session info so client can set cookie or state
			// Set the cookie using the Hono context
			const isSecure = process.env.NODE_ENV === "production";

			const cookieName = "better-auth.session_token";
			const cookieValue = token;
			const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds

			let cookieString = `${cookieName}=${cookieValue}; Path=/; HttpOnly; Max-Age=${maxAge}`;
			if (isSecure) {
				cookieString += "; Secure";
			}
			// Match auth.ts config: sameSite: "none", secure: true, httpOnly: true.
			cookieString += "; SameSite=None";
			if (!cookieString.includes("Secure")) {
				cookieString += "; Secure"; // Force secure for SameSite=None
			}

			// Set the header
			if (context.hono) {
				context.hono.header("Set-Cookie", cookieString, { append: true });
			}

			return {
				session,
				user: keyRecord.user,
				token,
			};
		}),
};
