import { Request, Response } from "express";
import { getUserById, updateUserToRed } from "../db/queries/users.js";

export async function handlerUpgradeToRed(req: Request, res: Response) {
    if (req.body.event !== "user.upgraded") {
        res.status(204).end();
        return;
    }
    await getUserById(req.body.data.userId);
    const user = await updateUserToRed(req.body.data.userId);
    res.status(204).end();    
}