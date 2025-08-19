import { Request, Response} from 'express';
import { config } from '../config.js'

export function handlerServerHits(req: Request, res: Response) {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.write(`
        <html>
            <body>
                <h1>Welcome, Chirpy Admin</h1>
                <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
            </body>
        </html>
    `);
    res.end()
}

export function handlerServerHitsReset(req: Request, res: Response) {
    config.api.fileServerHits = 0;
    res.send("Server Hits Reset");
}