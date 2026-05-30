import { createContext } from "@kc-rugengine/api/context";
import { appRouter } from "@kc-rugengine/api/routers/index";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import "dotenv/config";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: (origin) => {
			if (
				process.env.NODE_ENV === "development" ||
				(origin &&
					(origin.includes("//localhost:") || origin.includes("//127.0.0.1:")))
			) {
				return origin;
			}
			if (origin.endsWith(".rugpullengine.com")) {
				return origin;
			}
			return "https://rugpullengine.com";
		},
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

export const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

app.use("/*", async (c, next) => {
	const context = await createContext({ context: c });

	const rpcResult = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: context,
	});

	if (rpcResult.matched) {
		return c.newResponse(rpcResult.response.body, rpcResult.response);
	}

	const apiResult = await apiHandler.handle(c.req.raw, {
		prefix: "/api-reference",
		context: context,
	});

	if (apiResult.matched) {
		return c.newResponse(apiResult.response.body, apiResult.response);
	}

	await next();
});

app.get("/", (c) => {
	return c.text("OK");
});

export default app;
