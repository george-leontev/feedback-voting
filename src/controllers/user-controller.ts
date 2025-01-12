import { JsonController, Body, Param, Res, Get, Post } from 'routing-controllers'
import { UserModel } from '../models/user-model';
import { UserRepository } from '../repositories/user-repository';
import { DuplicateEntityError } from '../errors/duplicate-entity-error';


@JsonController('/users')
export class UserController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    @Get('/:id')
    async getAsync(@Param('id') id: number, @Res() response: any): Promise<any> {
        try {
            const user = await this.userRepository.getAsync(id);

            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }

            return user;
        }
        catch (error) {
            console.error(error);

            return response.status(500).json({ message: 'Internal server error: ' + (error as Error).message });
        }
    };

    @Post()
    async postAsync(@Body() user: UserModel, @Res() response: any): Promise<any> {

        try {
            const newUser = await this.userRepository.createAsync(user);

            return response.status(201).json(newUser);
        } catch (error: any) {
            console.error(error);
            if (error instanceof DuplicateEntityError) {
                return response.status(400).json({ message: error.message });
            }

            return response.status(500).json({ message: 'Internal server error' });
        }
    };
}