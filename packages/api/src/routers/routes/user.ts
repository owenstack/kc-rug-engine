import {
	createSession,
	createSessionCookie,
	serializeSessionCookie,
} from "@kc-rugengine/auth/session";
import prisma from "@kc-rugengine/db";
import { ORPCError } from "@orpc/server";
import * as z from "zod";
import { protectedProcedure, publicProcedure } from "../../index";

export const userRouter = {
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

			// 3. Create session using our custom session management
			const { session, token } = await createSession(keyRecord.userId);

			// 4. Create and set the session cookie
			const sessionCookie = createSessionCookie(token);
			const cookieString = serializeSessionCookie(sessionCookie);

			if (context.hono) {
				context.hono.header("Set-Cookie", cookieString, { append: true });
			}

			return {
				success: true,
				user: keyRecord.user,
				session: {
					id: session.id,
					expiresAt: session.expiresAt,
				},
			};
		}),

	logout: publicProcedure.handler(async ({ context }) => {
		// Get the session token from cookie
		const cookieHeader = context.hono?.req.header("cookie");
		if (!cookieHeader) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No session found",
			});
		}

		const sessionToken = parseSessionToken(cookieHeader);
		if (!sessionToken) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No session found",
			});
		}

		// Invalidate the session
		const sessionId = await getSessionIdFromToken(sessionToken);
		if (sessionId) {
			await prisma.session.delete({ where: { id: sessionId } });
		}

		// Clear the cookie
		const blankCookie = createBlankSessionCookie();
		const cookieString = serializeSessionCookie(blankCookie);

		if (context.hono) {
			context.hono.header("Set-Cookie", cookieString, { append: true });
		}

		return { success: true };
	}),
	getCurrentUser: protectedProcedure
		.output(
			z.object({
				id: z.string(),
				name: z.string(),
				email: z.string(),
				role: z.string(),
				emailVerified: z.boolean(),
				createdAt: z.date(),
				updatedAt: z.date(),
			}),
		)
		.handler(async ({ context }) => {
			return context.user;
		}),
};

// Helper functions
function parseSessionToken(cookieHeader: string): string | null {
	const cookies = cookieHeader.split(";").map((c) => c.trim());
	for (const cookie of cookies) {
		const [name, value] = cookie.split("=");
		if (name === "session") {
			return value || null;
		}
	}
	return null;
}

async function getSessionIdFromToken(token: string): Promise<string | null> {
	const sessionId = await sha256Hash(token);
	return sessionId;
}

async function sha256Hash(data: string): Promise<string> {
	const hashBuffer = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(data),
	);
	return Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

function createBlankSessionCookie() {
	return {
		name: "session",
		value: "",
		attributes: {
			httpOnly: true,
			secure: true,
			sameSite: "none" as const,
			path: "/",
			maxAge: 0,
		},
	};
}
