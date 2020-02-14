import bcrypt from "bcryptjs";

export type HashPassword = (
    password: string,
    rounds: number,
) => Promise<string>;

export async function hashPassword(
    password: string,
    rounds: number,
): Promise<string> {
    const salt = await bcrypt.genSalt(rounds);
    return bcrypt.hash(password, salt);
}