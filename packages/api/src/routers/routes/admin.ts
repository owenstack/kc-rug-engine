import {
	createSession,
	createSessionCookie,
	hashPassword,
	serializeSessionCookie,
	verifyPassword,
} from "@kc-rugengine/auth";
import prisma from "@kc-rugengine/db";
import { ORPCError } from "@orpc/client";
import * as z from "zod";
import { adminProcedure, publicProcedure } from "../../index";

export const adminRouter = {
	login: publicProcedure
		.input(
			z.object({
				email: z.email(),
				password: z.string().min(8),
			}),
		)
		.handler(async ({ input, context }) => {
			const user = await prisma.user.findUnique({
				where: { email: input.email },
			});

			if (!user || !user.passwordHash) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "Invalid email or password",
				});
			}

			const validPassword = await verifyPassword(
				user.passwordHash,
				input.password,
			);

			if (!validPassword) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "Invalid email or password",
				});
			}

			const { token } = await createSession(user.id);
			const sessionCookie = createSessionCookie(token);

			if (context.hono) {
				context.hono.header(
					"Set-Cookie",
					serializeSessionCookie(sessionCookie),
					{
						append: true,
					},
				);
			}

			return {
				success: true,
				user,
			};
		}),
	signup: publicProcedure
		.input(
			z.object({
				email: z.email(),
				password: z.string().min(8),
				name: z.string().min(2),
			}),
		)
		.handler(async ({ input, context }) => {
			const existingUser = await prisma.user.findUnique({
				where: { email: input.email },
			});

			if (existingUser) {
				throw new ORPCError("CONFLICT", {
					message: "User already exists",
				});
			}

			const passwordHash = await hashPassword(input.password);

			const user = await prisma.user.create({
				data: {
					email: input.email,
					name: input.name,
					passwordHash,
					role: "admin",
				},
			});

			const { token } = await createSession(user.id);
			const sessionCookie = createSessionCookie(token);

			if (context.hono) {
				context.hono.header(
					"Set-Cookie",
					serializeSessionCookie(sessionCookie),
					{
						append: true,
					},
				);
			}

			return {
				success: true,
				user,
			};
		}),
	createRestrictedUser: adminProcedure
		.input(
			z.object({
				name: z.string().min(2),
				expiresIn: z
					.number()
					.optional()
					.default(60 * 60 * 24 * 30), // Default 30 days
			}),
		)
		.handler(async ({ input }) => {
			const email = `apikey_${crypto.randomUUID()}@restricted.local`;

			// 1. Create the User
			const user = await prisma.user.create({
				data: {
					id: crypto.randomUUID(),
					name: input.name,
					email: email,
					emailVerified: true,
					role: "user", // Restricted users are just users
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			});

			// 2. Generate API Key
			// Generate a secure random string
			const keyBytes = new Uint8Array(32);
			crypto.getRandomValues(keyBytes);
			const keyBody = Buffer.from(keyBytes)
				.toString("base64")
				.replace(/[^a-zA-Z0-9]/g, "")
				.substring(0, 32);
			const key = `RUGENGINE_${keyBody}`;

			// 3. Create the API Key record
			// We manually verify defaults from better-auth schema
			await prisma.apikey.create({
				data: {
					id: crypto.randomUUID(),
					key: key,
					name: `Generated for ${input.name}`,
					userId: user.id,
					prefix: "RUGENGINE",
					enabled: true,
					createdAt: new Date(),
					updatedAt: new Date(),
					rateLimitEnabled: true,
					// Calculate expiresAt
					expiresAt: new Date(Date.now() + input.expiresIn * 1000),
				},
			});

			return {
				user,
				apiKey: key,
			};
		}),
	listUsers: adminProcedure
		.input(
			z.object({
				query: z.object({}).optional(),
			}),
		)
		.handler(async () => {
			const users = await prisma.user.findMany();
			return {
				data: {
					total: users.length,
					users,
				},
			};
		}),
};
