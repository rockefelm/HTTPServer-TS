import { Request, Response } from "express";
import { getUserById, updateUserToRed } from "../db/queries/users.js";
import { getAPIKey } from "./auth.js";
import { config } from "../config.js";
import { UserNotAuthenticatedError } from "./errors.js";

export async function handlerUpgradeToRed(req: Request, res: Response) {
    if (req.body.event !== "user.upgraded") {
        res.status(204).end();
        return;
    }
    const apiKey = getAPIKey(req);
    if (apiKey !== config.api.polkaKey) {
        throw new UserNotAuthenticatedError("Authentication Failed");
    }
    await getUserById(req.body.data.userId);
    const user = await updateUserToRed(req.body.data.userId);
    res.status(204).end();    
}