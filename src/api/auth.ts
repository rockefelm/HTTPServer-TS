import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"
import { Request } from "express";
import { randomBytes } from "crypto";
import { UserNotAuthenticatedError } from "./errors.js";

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
            throw new UserNotAuthenticatedError("Invalid or expired token");
        }

    } catch (error) {
        throw new UserNotAuthenticatedError("Invalid or expired token");
    }
    
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UserNotAuthenticatedError("missing Authorization header")
    }
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length < 2 || tokenParts[0] !== "Bearer") {
        throw new UserNotAuthenticatedError("Invalid Authorization header");
    }

    return tokenParts[1];
}

export function makeRefreshToken() {
    const token = randomBytes(32).toString('hex');
    return token;
}

export function getAPIKey(req: Request) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UserNotAuthenticatedError("missing Authorization header")
    }
    const keyParts = authHeader.split(" ");
    if (keyParts.length < 2 || keyParts[0] !== "ApiKey") {
        throw new UserNotAuthenticatedError("Invalid Authorization header");
    }
    return keyParts[1];
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;