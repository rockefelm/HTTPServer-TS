import { Request, Response} from 'express';
import { config } from '../config.js'
import { UserForbiddenError } from './errors.js';
import { resetUsers } from '../db/queries/users.js';

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