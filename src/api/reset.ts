import { Request, Response} from "express";
import { UserForbiddenError } from "./errors.js";
import { config } from "../config.js";
import { resetUsers } from "../db/queries/users.js";

export async function handlerServerReset(req: Request, res: Response) {
    if (config.api.platform !== "dev") {
        throw new UserForbiddenError("Reset is only allowed in dev environment.");
    }
    config.api.fileServerHits = 0;
    await resetUsers();
    res.send("Server Hits Reset");
    
}