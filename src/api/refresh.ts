import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "./auth.js";
import { getUserFromRefreshToken } from "../db/queries/users.js";
import { config } from "../config.js";

export async function handlerRefreshToken(req: Request, res: Response) {
    const token = getBearerToken(req);
    const user = await getUserFromRefreshToken(token);
    const tokenJWT = makeJWT(user.id, 3600, config.jwt.secret);
    res.status(200).send({"token": tokenJWT});
}