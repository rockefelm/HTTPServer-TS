import { db } from "../index.js";
import { NewToken, refreshTokens } from "../schema.js";
import { UserNotAuthenticatedError } from "../../api/errors.js";
import { eq, and, isNull, gt } from "drizzle-orm";

export async function storeRefreshToken(refreshToken: NewToken) {
    const [storedToken] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .onConflictDoNothing()
        .returning()
    return storedToken;
}

export async function getRefreshToken(token: string) {
    const [refreshToken] = await db
        .select()
        .from(refreshTokens)
        .where(and(
          eq(refreshTokens.token, token),
          isNull(refreshTokens.revokedAt),
          gt(refreshTokens.expiresAt, new Date())
        ))
        .limit(1);
    if (!refreshToken) {
        throw new UserNotAuthenticatedError(`Token : ${token} not Found`);
    }
    return refreshToken;
}