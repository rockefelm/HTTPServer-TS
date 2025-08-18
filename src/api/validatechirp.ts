import {Request, Response} from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    let body = ""; // Initializer

    req.on("data", (item) => {
        body += item;
    }); // listens for data events and puts them and adds them to the body.

    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(body); 
            if (parsedBody.body.length <= 140) {
                res.send({ "valid": true });
            } else {
                res.status(400).send({ "error": "Chirp is too long"});
            }
        } catch (error) {
            res.status(400).send({ error: "Something went wrong" });
        }
    }); /* parses the body into a JSON blob and returns the 
        appropriate response based on the length of the chirp. */
}