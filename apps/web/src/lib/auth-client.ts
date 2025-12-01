import type { auth } from "@kc-rugengine/auth";
import {
	apiKeyClient,
	inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_SERVER_URL,
	plugins: [inferAdditionalFields<typeof auth>(), apiKeyClient()],
});

export const { getSession, useSession, signIn, signOut, signUp, apiKey } =
	authClient;
