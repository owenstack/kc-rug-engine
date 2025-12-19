import {
	createSessionCookie,
	parseSessionToken,
	serializeSessionCookie,
	validateSessionToken,
} from "@kc-rugengine/auth/session";

export async function validateSession(request: Request) {
	const cookieHeader = request.headers.get("cookie");
	const token = parseSessionToken(cookieHeader || null);

	if (!token) {
		return { session: null, user: null, cookie: null };
	}

	const result = await validateSessionToken(token);

	if (!result) {
		return { session: null, user: null, cookie: null };
	}

	// If session was extended, set a new cookie
	// This happens when the session is close to expiration (less than 15 days)
	// We'll check if we need to refresh the cookie by comparing dates
	const now = Date.now();
	const fifteenDays = 1000 * 60 * 60 * 24 * 15;
	const shouldRefreshCookie =
		result.session.expiresAt.getTime() - now > fifteenDays;

	let cookieToSet: string | null = null;
	if (shouldRefreshCookie) {
		const sessionCookie = createSessionCookie(token);
		cookieToSet = serializeSessionCookie(sessionCookie);
	}

	return {
		session: result.session,
		user: result.user,
		cookie: cookieToSet,
	};
}
