import { Request, Response} from 'express';
import { config } from '../config.js'

export function handlerServerHits(req: Request, res: Response) {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(`Hits: ${config.fileServerHits}`);
}

export function handlerServerHitsReset(req: Request, res: Response) {
    config.fileServerHits = 0;
    res.send("Server Hits Reset");
}