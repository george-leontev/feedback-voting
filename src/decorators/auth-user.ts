import { createParamDecorator } from 'routing-controllers';

/**
 * AuthUser is a custom parameter decorator that ensures that the user is present and throws an
 * error if unauthorized access is attempted.
 * @returns {Function} A decorator function that can be applied to controller methods.
 */
export function AuthUser() {
    return createParamDecorator({
        required: true, // Indicates that the user parameter is required
        value: (action) => {
            const user = action.request.user; // Extract the user from the request object
            if (!user) {
                throw new Error('Unauthorized'); // Throw an error if the user is not authenticated
            }

            return user;
        },
    });
}