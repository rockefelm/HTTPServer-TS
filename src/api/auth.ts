import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPwd = await bcrypt.hash(password, saltRounds);
    return hashedPwd;
}

export async function checkPasswordHash(password: string, hash: string) {
    const isPassword = await bcrypt.compare(password, hash);
    return isPassword;
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000);
    const payLoad: payload = {
        iss: "chirpy",
        sub: userID,
        iat,
        exp: iat + expiresIn,
    }
    const token = jwt.sign(payLoad, secret);
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const verified = jwt.verify(tokenString, secret);
        if (typeof verified === 'object' && verified !== null && verified.sub) {
            const id = verified.sub;
            return id;
        } else {
            throw new Error("Invalid or expired token");
        }

    } catch (error) {
        throw new Error("Invalid or expired token");
    }
    
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;