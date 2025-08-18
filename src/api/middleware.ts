import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const code = res.statusCode;
        if (code !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${code}`);
        }
    });
    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileServerHits++;
    next ();
}

export function errorMiddleWare(
    err: Error,
    _: Request,
    res: Response,
    __: NextFunction,
    ) {
    let statusCode = 500;
    let message = "Something went wrong on our end";

    console.log(err.message);

    res.status(statusCode).send({
        error: message
    })
}