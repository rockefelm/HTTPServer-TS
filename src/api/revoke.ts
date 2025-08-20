import { Request, Response } from "express";
import { getBearerToken } from "./auth.js";
import { getRefreshToken } from "../db/queries/tokens.js";
import { db } from "../db/index.js";
import { refreshTokens } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function handlerRevokeToken(req: Request, res: Response) {
    const token = getBearerToken(req);
    await getRefreshToken(token); // Validates token, throws if not valid.
    await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.token, token));
    res.status(204).end();
}