import { Request, Response } from "express";
import { getBearerToken, validateJWT, hashPassword } from "./auth.js";
import { config } from "../config.js";
import { BadRequestError } from "./errors.js";
import { isValidEmail } from "./validate_email.js";
import { getUserById, updateUser } from "../db/queries/users.js";

export async function handlerUpdateUser(req: Request, res: Response) {

    const token = getBearerToken(req);
    const validId = validateJWT(token, config.jwt.secret);
    
    if (!req.body.email || !req.body.password) {
            throw new BadRequestError("email or password missing");
    }
    const emailCheck = isValidEmail(req.body.email);
    if (!emailCheck) {
        throw new BadRequestError("Invalid email");
    }

    const hashedPassword = await hashPassword(req.body.password);
    getUserById(validId);
    const user = await updateUser({ email: req.body.email, hashedPwd: hashedPassword}, validId);
    const { hashedPwd, ...secureUser } = user;
    res.status(200).send(secureUser);
}