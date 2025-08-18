import {Request, Response} from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    try { 
        if (req.body.body.length <= 140) {
            res.send({ "valid": true });
            } else {
                res.status(400).send({ "error": "Chirp is too long"});
            }
        } catch (error) {
            res.status(400).send({ error: "Something went wrong" });
        }
}
