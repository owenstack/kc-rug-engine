import type { auth } from "@kc-rugengine/auth";
import {
	adminClient,
	apiKeyClient,
	inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_SERVER_URL,
	plugins: [
		inferAdditionalFields<typeof auth>(),
		apiKeyClient(),
		adminClient(),
	],
});

export const {
	getSession,
	useSession,
	signIn,
	signOut,
	signUp,
	apiKey,
	admin,
} = authClient;
