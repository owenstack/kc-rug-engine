import alchemy from "alchemy";
import { R2Bucket, Vite, Worker } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "./apps/web/.env" });
config({ path: "./apps/server/.env" });

const app = await alchemy("kc-rugengine");

const bucket = await R2Bucket("assets", {
	devDomain: true,
	name: "rugpullengine-assets",
});

export const web = await Vite("web", {
	cwd: "apps/web",
	assets: "dist",
	bindings: {
		VITE_SERVER_URL:
			process.env.NODE_ENV === "development"
				? "http://localhost:3000"
				: "https://api.rugpullengine.com",
	},
	dev: {
		command: "bun run dev",
	},
});

export const server = await Worker("server", {
	cwd: "apps/server",
	entrypoint: "src/index.ts",
	compatibility: "node",
	bindings: {
		DATABASE_URL: alchemy.secret(process.env.DATABASE_URL),
		NODE_ENV: process.env.NODE_ENV || "production",
		BETTER_AUTH_SECRET: alchemy.secret(process.env.BETTER_AUTH_SECRET),
		BETTER_AUTH_URL:
			process.env.NODE_ENV === "development"
				? "http://localhost:3000"
				: "https://api.rugpullengine.com",
		BUCKET: bucket,
		BUCKET_URL: bucket.devDomain ?? "",
	},
	dev: {
		port: 3000,
	},
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

await app.finalize();
