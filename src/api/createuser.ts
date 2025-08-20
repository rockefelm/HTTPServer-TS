import { Request, Response } from "express";
import { isValidEmail } from "./validate_email.js";
import { BadRequestError } from "./errors.js";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "./auth.js";
import { SecureUser } from "../db/schema.js";

export async function handlerCreateUser(req: Request, res: Response) {
    if (!req.body.email) {
        throw new BadRequestError("Missing email");
    }
    const emailCheck = isValidEmail(req.body.email);
    if (!emailCheck) {
        throw new BadRequestError("Invalid email");
    }
    if (!req.body.password) {
        throw new BadRequestError("missing Password");
    }

    const hashedPassword = await hashPassword(req.body.password);
    
    const user = await createUser({
        hashedPwd: hashedPassword,
        email: req.body.email
    });
    const { hashedPwd, ...secureUser }: SecureUser = user;
    res.status(201).send(secureUser);
}