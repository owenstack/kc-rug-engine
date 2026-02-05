import prisma from "@kc-rugengine/db";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../../index";

// Dedicated wallet addresses for each cryptocurrency
const MIXER_WALLETS = {
	BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
	ETH: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
	SOL: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
	LTC: "ltc1qhsj5ha6vdxjzp7zz5zqz5qzqzqzqzqzqz",
	USDT: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
} as const;

const FEE_RANGES = {
	BTC: { min: 0.5, max: 3 },
	ETH: { min: 0.5, max: 2.5 },
	SOL: { min: 0.3, max: 2 },
	LTC: { min: 0.5, max: 2 },
	USDT: { min: 1, max: 3 },
} as const;

export const mixerRouter = {
	createMixerTransaction: publicProcedure
		.input(
			z.object({
				cryptocurrency: z.enum(["BTC", "ETH", "SOL", "LTC", "USDT"]),
				amount: z.string().min(1),
				destinationAddresses: z.array(z.string()).min(1).max(5),
				delayHours: z.number().min(0).max(72),
			}),
		)
		.handler(async ({ input, context }) => {
			const { cryptocurrency, amount, destinationAddresses, delayHours } =
				input;

			// Calculate random fee within range
			const feeRange = FEE_RANGES[cryptocurrency];
			const feePercentage =
				Math.random() * (feeRange.max - feeRange.min) + feeRange.min;

			// Get dedicated deposit address for this cryptocurrency
			const depositAddress = MIXER_WALLETS[cryptocurrency];

			// Get userId from session if exists
			const userId = context.user?.id || null;

			// Create mixer transaction
			const transaction = await prisma.mixerTransaction.create({
				data: {
					userId,
					cryptocurrency,
					amount,
					destinationAddresses: JSON.stringify(destinationAddresses),
					delayHours,
					depositAddress,
					feePercentage,
					status: "pending",
				},
			});

			return {
				success: true,
				transaction: {
					id: transaction.id,
					depositAddress: transaction.depositAddress,
					cryptocurrency: transaction.cryptocurrency,
					amount: transaction.amount,
					feePercentage: transaction.feePercentage,
					status: transaction.status,
				},
			};
		}),

	updateMixerStatus: publicProcedure
		.input(
			z.object({
				transactionId: z.string(),
				status: z.enum(["pending", "processing", "completed", "failed"]),
			}),
		)
		.handler(async ({ input }) => {
			const { transactionId, status } = input;

			const transaction = await prisma.mixerTransaction.update({
				where: { id: transactionId },
				data: {
					status,
					completedAt: status === "completed" ? new Date() : null,
				},
			});

			return {
				success: true,
				transaction,
			};
		}),

	getMixerTransaction: publicProcedure
		.input(
			z.object({
				transactionId: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			const transaction = await prisma.mixerTransaction.findUnique({
				where: { id: input.transactionId },
			});

			if (!transaction) {
				throw new ORPCError("NOT_FOUND", {
					message: "Transaction not found",
				});
			}

			return {
				success: true,
				transaction: {
					...transaction,
					destinationAddresses: JSON.parse(transaction.destinationAddresses),
				},
			};
		}),

	getUserMixerTransactions: protectedProcedure.handler(async ({ context }) => {
		const transactions = await prisma.mixerTransaction.findMany({
			where: { userId: context.user.id },
			orderBy: { createdAt: "desc" },
			take: 50,
		});

		return {
			success: true,
			transactions: transactions.map((t) => ({
				...t,
				destinationAddresses: JSON.parse(t.destinationAddresses),
			})),
		};
	}),

	getWalletAddress: publicProcedure
		.input(
			z.object({
				cryptocurrency: z.enum(["BTC", "ETH", "SOL", "LTC", "USDT"]),
			}),
		)
		.handler(async ({ input }) => {
			const address = MIXER_WALLETS[input.cryptocurrency];

			return {
				success: true,
				address,
				cryptocurrency: input.cryptocurrency,
			};
		}),

	getAllWalletAddresses: publicProcedure.handler(async () => {
		return {
			success: true,
			wallets: MIXER_WALLETS,
		};
	}),
};
