import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPwd = await bcrypt.hash(password, saltRounds);
    return hashedPwd;
}

export async function checkPasswordHash(password: string, hash: string) {
    const isPassword = await bcrypt.compare(password, hash);
    return isPassword;
}