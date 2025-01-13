import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Response, Request } from 'express'
import { ExpressMiddlewareInterface } from 'routing-controllers';

export class Authorize implements ExpressMiddlewareInterface {
    use(request: Request, response: Response, next: (err?: any) => any) {
        const authorizationHeader = request.headers['authorization'];
        if (!authorizationHeader) {
            return response.status(StatusCodes.UNAUTHORIZED).send('Access denied');
        }

        const authorizationHeaderParts = (authorizationHeader as string).split(' ');
        if (authorizationHeaderParts.length < 2) {
            return response.status(StatusCodes.UNAUTHORIZED).send('Access denied');
        }

        const token = authorizationHeaderParts[1];

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET!);
            (request as any).user = verified;
            next();

        } catch (err) {
            return response.status(StatusCodes.BAD_REQUEST).send('Invalid Token');
        }
    }
}