import bcrypt from "bcryptjs";


export async function hashPassword(
    password: string,
    rounds: number,
): Promise<string> {
    const salt = await bcrypt.genSalt(rounds);
    return bcrypt.hash(password, salt);
}


export async function comparePassword(
    providedPass: string,
    storedPass: string,
): Promise<boolean> {
    const passwordIsMatched = await bcrypt.compare(providedPass, storedPass);
    return passwordIsMatched;
}