import { Request, Response } from "express";
import { isValidEmail } from "./validate_email.js";
import { BadRequestError } from "./errors.js";
import { createUser } from "../db/queries/users.js";

export async function handlerCreateUser(req: Request, res: Response) {
    const emailCheck = isValidEmail(req.body.email);
    if (!emailCheck) {
        throw new BadRequestError("Invalid email");
    }
    
    const user = await createUser({
        email: req.body.email
    });
    res.status(201).send(user);
}