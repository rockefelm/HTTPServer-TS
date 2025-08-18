import {Request, Response} from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    if (req.body.body.length > 140) {
        throw new Error("Chirp is too long");
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
