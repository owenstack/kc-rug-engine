import bcryptjs from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
	return await bcryptjs.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
	hash: string,
	password: string,
): Promise<boolean> {
	return await bcryptjs.compare(password, hash);
}
