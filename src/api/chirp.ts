import {Request, Response} from "express";
import { BadRequestError, NotFoundError, UserNotAuthenticatedError } from "./errors.js";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { isValidUUID } from "./validate_uuid.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";

export async function handlerChirp(req: Request, res: Response) {
    
    const token = getBearerToken(req);
    const validId = validateJWT(token, config.jwt.secret);    
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
    const chirp = await createChirp({
        body: filtered,
        userId: validId,
    });
    res.status(201).send(chirp);
}

export async function handlerGetAllChirps(req: Request, res: Response) {
    const chirps = await getAllChirps();
    res.status(200).send(chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
    const chirpId = req.params.chirpId;
    if (!isValidUUID(chirpId)) {
        throw new NotFoundError('Chirp not found')
    }
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError('Chirp not found');
    }
    res.status(200).send(chirp);
}

