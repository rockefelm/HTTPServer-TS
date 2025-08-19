import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { 
    BadRequestError, 
    UserNotAuthenticatedError, 
    UserForbiddenError, 
    NotFoundError 
} from "./errors.js";

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
    config.api.fileServerHits++;
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

    if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
    } else if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;
    } else if (err instanceof UserForbiddenError) {
        statusCode = 403;
        message = err.message;
    } else if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }

    if (statusCode >= 500) {
        console.log(err.message);
    }

    res.status(statusCode).send({
        error: message
    })
}