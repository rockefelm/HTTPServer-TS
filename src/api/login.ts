import { Request, Response} from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash } from "./auth.js";
import { SecureUser } from "../db/schema.js";

export async function loginHandler(req: Request, res: Response) {
    if (!req.body.email || !req.body.password) {
        throw new BadRequestError("email or password missing")
    }
    const user = await getUserByEmail(req.body.email);
    const passCheck = await checkPasswordHash(req.body.password, user.hashedPwd);
    if (passCheck === false) {
        throw new UserNotAuthenticatedError("Unauthorized");
    }
    const { hashedPwd, ...secureUser }: SecureUser = user;
    res.status(200).send(secureUser);
}