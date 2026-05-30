import type { User } from "@kc-rugengine/db";
import prisma from "@kc-rugengine/db";

// Session interface
export interface Session {
	id: string;
	userId: string;
	expiresAt: Date;
}

export interface SessionValidationResult {
	session: Session;
	user: User;
}

// Generate a secure random session token
export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCase(bytes);
	return token;
}

// Base32 encoding (case-insensitive, URL-safe)
function encodeBase32LowerCase(data: Uint8Array): string {
	const alphabet = "abcdefghijklmnopqrstuvwxyz234567";
	let bits = 0;
	let value = 0;
	let output = "";

	for (let i = 0; i < data.length; i++) {
		value = (value << 8) | (data[i] ?? 0);
		bits += 8;

		while (bits >= 5) {
			output += alphabet[(value >>> (bits - 5)) & 31];
			bits -= 5;
		}
	}

	if (bits > 0) {
		output += alphabet[(value << (5 - bits)) & 31];
	}

	return output;
}

// SHA-256 hash for session ID
async function sha256(data: Uint8Array): Promise<Uint8Array> {
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return new Uint8Array(hashBuffer);
}

// Convert bytes to hex string
function encodeHexLowerCase(data: Uint8Array): string {
	return Array.from(data)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

// Create a new session
export async function createSession(
	userId: string,
): Promise<{ session: Session; token: string }> {
	const token = generateSessionToken();
	const sessionId = encodeHexLowerCase(
		await sha256(new TextEncoder().encode(token)),
	);

	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

	const session: Session = {
		id: sessionId,
		userId,
		expiresAt,
	};

	await prisma.session.create({
		data: {
			id: session.id,
			userId: session.userId,
			expiresAt: session.expiresAt,
		},
	});

	return { session, token };
}

// Validate session token
export async function validateSessionToken(
	token: string,
): Promise<SessionValidationResult | null> {
	const sessionId = encodeHexLowerCase(
		await sha256(new TextEncoder().encode(token)),
	);

	const sessionData = await prisma.session.findUnique({
		where: { id: sessionId },
		include: { user: true },
	});

	if (!sessionData) {
		return null;
	}

	const session: Session = {
		id: sessionData.id,
		userId: sessionData.userId,
		expiresAt: sessionData.expiresAt,
	};

	// Check if session has expired
	if (Date.now() >= session.expiresAt.getTime()) {
		await prisma.session.delete({ where: { id: session.id } });
		return null;
	}

	// Extend session if it's close to expiration (less than 15 days left)
	const fifteenDaysInMs = 1000 * 60 * 60 * 24 * 15;
	if (Date.now() >= session.expiresAt.getTime() - fifteenDaysInMs) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await prisma.session.update({
			where: { id: session.id },
			data: { expiresAt: session.expiresAt },
		});
	}

	return { session, user: sessionData.user };
}

// Invalidate session
export async function invalidateSession(sessionId: string): Promise<void> {
	await prisma.session.delete({ where: { id: sessionId } });
}

// Invalidate all user sessions
export async function invalidateUserSessions(userId: string): Promise<void> {
	await prisma.session.deleteMany({ where: { userId } });
}

// Cookie utilities
export interface SessionCookie {
	name: string;
	value: string;
	attributes: {
		httpOnly: boolean;
		secure: boolean;
		sameSite: "lax" | "strict" | "none";
		path: string;
		maxAge: number;
	};
}

export function createSessionCookie(token: string): SessionCookie {
	return {
		name: "session",
		value: token,
		attributes: {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			path: "/",
			maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
		},
	};
}

export function createBlankSessionCookie(): SessionCookie {
	return {
		name: "session",
		value: "",
		attributes: {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			path: "/",
			maxAge: 0, // Expire immediately
		},
	};
}

export function serializeSessionCookie(cookie: SessionCookie): string {
	const attrs = cookie.attributes;
	let cookieString = `${cookie.name}=${cookie.value}; Path=${attrs.path}; Max-Age=${attrs.maxAge}`;

	if (attrs.httpOnly) {
		cookieString += "; HttpOnly";
	}

	if (attrs.secure) {
		cookieString += "; Secure";
	}

	if (attrs.sameSite) {
		cookieString += `; SameSite=${attrs.sameSite.charAt(0).toUpperCase() + attrs.sameSite.slice(1)}`;
	}

	return cookieString;
}

// Parse session token from cookie header
export function parseSessionToken(cookieHeader: string | null): string | null {
	if (!cookieHeader) {
		return null;
	}

	const cookies = cookieHeader.split(";").map((c) => c.trim());
	for (const cookie of cookies) {
		const [name, value] = cookie.split("=");
		if (name === "session") {
			return value || null;
		}
	}

	return null;
}
