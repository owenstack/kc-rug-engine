import prisma from "@kc-rugengine/db";
import { z } from "zod";
import { adminProcedure } from "../../index";

export const adminAuthRouter = {
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
};
