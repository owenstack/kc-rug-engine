import prisma from "@kc-rugengine/db";
import * as z from "zod";
import { protectedProcedure } from "../..";

export const coinRouter = {
	createCoin: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				ticker: z.string().min(2, "Ticker must be at least 2 characters long"),
				decimals: z.number().min(0).max(9),
				description: z.string(),
				websiteUrl: z.url(),
				twitterUrl: z.url(),
				telegramUrl: z.url(),
				marketCap: z.number().min(0).max(100_000),
				image: z.url(),
				revoke: z.array(z.string()),
			}),
		)
		.handler(async ({ input, context }) => {
			const userId = context.user.id;
			const coin = await prisma.coin.create({ data: { ...input, userId } });
			return { coinId: coin.id };
		}),

	createWallets: protectedProcedure
		.input(
			z.object({
				devBuyAmount: z.number().min(0, "Dev buy amount must be at least 0"),
				bundledByAmount: z
					.number()
					.min(0, "Bundled by amount must be at least 0"),
				bundledWalletAmount: z
					.number()
					.min(0, "Bundled wallet amount must be at least 0"),
				slippage: z
					.number()
					.min(0)
					.max(100, "Slippage must be between 0 and 100"),
				bundledLaunchType: z.string(),
				coinId: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			const wallet = await prisma.bundledWallet.create({ data: input });
			return { walletId: wallet.id };
		}),
	createAutoVolume: protectedProcedure
		.input(
			z.object({
				coinId: z.string(),
				volume: z.number().min(0, "Volume must be at least 0"),
				minBuyAmount: z.number().min(0, "Min buy amount must be at least 0"),
				maxBuyAmount: z.number().min(0, "Max buy amount must be at least 0"),
				slippage: z.number().min(0).max(1, "Slippage must be between 0 and 1"),
				delay: z.number().min(0, "Delay must be at least 0"),
			}),
		)
		.handler(async ({ input }) => {
			const autoVolume = await prisma.volume.create({ data: input });
			return { autoVolumeId: autoVolume.id };
		}),
	getUserCoins: protectedProcedure.handler(async ({ context }) => {
		const userId = context.user.id;
		const coins = await prisma.coin.findMany({
			where: { userId },
			select: {
				id: true,
				name: true,
				ticker: true,
				websiteUrl: true,
				twitterUrl: true,
				telegramUrl: true,
				marketCap: true,
				image: true,
			},
		});
		return { coins };
	}),
};
