import {Request, Response} from "express";
import { BadRequestError } from "./errors.js";

export async function handlerValidateChirp(req: Request, res: Response) {
    
    const maxChirpLength = 140;
    if (req.body.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    } 

    const words = req.body.body.split(" ");

    const badWords = ["kerfuffle", "sharbert", "fornax"];
    for (let i = 0; i < words.length; i++) {
        const word = words[i]
        const lowerWord = word.toLowerCase();
        if (badWords.includes(lowerWord)) {
            words[i] = "****";
        }
    }

    const filtered = words.join(" ");
    res.send({ cleanedBody: filtered });
}
