import { Request, Response} from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "./auth.js";
import { SecureUser } from "../db/schema.js";
import { config } from "../config.js";
import { storeRefreshToken } from "../db/queries/tokens.js";

export async function loginHandler(req: Request, res: Response) {
    if (!req.body.email || !req.body.password) {
        throw new BadRequestError("email or password missing")
    }
    const user = await getUserByEmail(req.body.email);
    const passCheck = await checkPasswordHash(req.body.password, user.hashedPwd);
    if (passCheck === false) {
        throw new UserNotAuthenticatedError("Unauthorized");
    }
    const token = makeJWT(user.id, 3600, config.jwt.secret);
    const refreshTokenLifetimeDays = parseInt(process.env.REFRESH_TOKEN_LIFETIME_DAYS ?? "60", 10);
    // Calculate milliseconds in the desired lifetime (days → ms)
    const expiresAt = new Date(Date.now() + refreshTokenLifetimeDays * 24 * 60 * 60 * 1000);
    const refreshToken = makeRefreshToken();
    const storedToken = await storeRefreshToken({
        userId: user.id,
        token: refreshToken,
        expiresAt: expiresAt,
        revokedAt: null
    });
    const { hashedPwd, ...secureUser }: SecureUser = user;
    res.status(200).send({
        ...secureUser,
        token: token,
        refreshToken: refreshToken
    });
}