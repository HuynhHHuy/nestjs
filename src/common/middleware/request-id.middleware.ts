import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class requestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const requestId = randomUUID();
        req['requestId'] = requestId;
        res.setHeader('x-request-id', requestId);

        console.log(`[${requestId}]`, req.method, req.originalUrl);

        next();
    }
}
