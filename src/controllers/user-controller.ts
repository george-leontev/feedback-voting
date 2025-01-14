import { JsonController, Body, Param, Res, Get, Post, UseBefore, HttpCode } from 'routing-controllers'
import { UserModel } from '../models/user-model';
import { UserRepository } from '../repositories/user-repository';
import { DuplicateEntityError } from '../errors/duplicate-entity-error';
import { StatusCodes } from 'http-status-codes';
import { Authorize } from '../middleware/authorize';
import { AuthUser } from '../decorators/auth-user';

/**
 * UserController handles HTTP requests related to user operations.
 * It provides endpoints to get and post user.
 */
@UseBefore(Authorize) // Do unable to use this controller endpoints until authorized
@JsonController('/api/users') // Define the base path for all routes in user controller
export class UserController {

    /**
     * Creates a new UserRepository instance for handling user operations
     */
    constructor(private userRepository: UserRepository) {
        this.userRepository = new UserRepository();
    }

    @Get('/:id')
    async getAsync(@AuthUser() authUser: any, @Param('id') id: number, @Res() response: any): Promise<any> {
        try {
            const user = await this.userRepository.getAsync(id);

            if (!user) {
                return response.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            }

            return user;
        }
        catch (error) {
            console.error(error);

            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error: ' + (error as Error).message });
        }
    };

    @Post()
    @HttpCode(StatusCodes.CREATED) // HTTP response code to 201 (Created) for successful creation
    async postAsync(@Body() user: UserModel, @Res() response: any): Promise<any> {

        try {
            const newUser = await this.userRepository.createAsync(user);

            return newUser;
        }
        catch (error: any) {
            console.error(error);
            if (error instanceof DuplicateEntityError) {
                return response.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
            }

            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };
}