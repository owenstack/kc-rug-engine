import { env } from "cloudflare:workers";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";
import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaPostgresAdapter({
	connectionString: env.DATABASE_URL || "",
});

const prisma = new PrismaClient({ adapter });

export default prisma;
