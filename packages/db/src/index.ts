import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";
import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaPostgresAdapter({
	connectionString: process.env.DATABASE_URL || "",
});

const prisma = new PrismaClient({ adapter });

export * from "../prisma/generated/client";
export default prisma;
