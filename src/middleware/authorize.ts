import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Response, Request } from 'express'
import { ExpressMiddlewareInterface } from 'routing-controllers';

/**
 * Authorize is a middleware class that handles JWT authentication for incoming requests.
 * It verifies the presence and validity of a JWT token in the Authorization header.
 */
export class Authorize implements ExpressMiddlewareInterface {

    /**
     * Middleware function that checks for a valid JWT token in the request.
     * @param {Request} request - The incoming request object.
     * @param {Response} response - The response object used to send responses.
     * @param {Function} next - The next middleware function to call.
     */
    use(request: Request, response: Response, next: (err?: any) => any) {
        // Retrieve the Authorization header from the request
        const authorizationHeader = request.headers['authorization'];
        if (!authorizationHeader) {
            return response.status(StatusCodes.UNAUTHORIZED).send('Access denied');
        }

        const authorizationHeaderParts = (authorizationHeader as string).split(' ');
        if (authorizationHeaderParts.length < 2) {
            return response.status(StatusCodes.UNAUTHORIZED).send('Access denied');
        }

        const token = authorizationHeaderParts[1]; // Extract the token from the header

        try {
             // Verify the token using the secret key
            const verified = jwt.verify(token, process.env.JWT_SECRET!);
            (request as any).user = verified;  // Attach the verified user information to the request
            next(); // Proceed to the next middleware or route handler

        } catch (err) {
            return response.status(StatusCodes.BAD_REQUEST).send('Invalid Token');
        }
    }
}