import { env } from "cloudflare:workers";
import prisma from "@kc-rugengine/db";
import * as z from "zod";
import { protectedProcedure } from "../..";

export const documentRouter = {
	uploadDocument: protectedProcedure
		.input(z.object({ file: z.instanceof(File) }))
		.handler(async ({ input, context }) => {
			const userId = context.user.id;
			const putResult = await env.BUCKET.put(input.file.name, input.file.name, {
				httpMetadata: {
					contentType: input.file.type,
				},
			});
			const document = await prisma.document.create({
				data: {
					userId,
					type: input.file.type,
					url: `https://${env.BUCKET_URL}/${input.file.name}`,
					key: putResult.key,
				},
			});
			return document;
		}),
};
