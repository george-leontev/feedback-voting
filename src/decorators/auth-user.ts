import { createParamDecorator } from 'routing-controllers';

export function AuthUser() {
    return createParamDecorator({
        required: true,
        value: (action) => {
            const user = action.request.user;
            if (!user) {
                throw new Error('Unauthorized');
            }

            return user;
        },
    });
}