import { Request, Response} from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, makeJWT } from "./auth.js";
import { SecureUser } from "../db/schema.js";
import { config } from "../config.js";

export async function loginHandler(req: Request, res: Response) {
    if (!req.body.email || !req.body.password) {
        throw new BadRequestError("email or password missing")
    }
    const user = await getUserByEmail(req.body.email);
    const passCheck = await checkPasswordHash(req.body.password, user.hashedPwd);
    if (passCheck === false) {
        throw new UserNotAuthenticatedError("Unauthorized");
    }
    let expiresInSeconds = 3600;
    if (req.body.expiresInSeconds && req.body.expiresInSeconds <= 3600) {
        expiresInSeconds = req.body.expiresInSeconds;
    }
    const token = makeJWT(user.id, expiresInSeconds, config.jwt.secret);
    const { hashedPwd, ...secureUser }: SecureUser = user;
    res.status(200).send({
        ...secureUser,
        token: token
    });
}