import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Body, HttpCode, JsonController, Post, UnauthorizedError } from "routing-controllers";
import { LoginModel } from '../models/login-model';
import { UserRepository } from '../repositories/user-repository';

@JsonController('/auth')
export class AuthController {
    constructor(private userRepository: UserRepository) {
        this.userRepository = new UserRepository();
    }

    @Post('/sign-in')
    @HttpCode(200)
    async signIn(@Body() login: LoginModel) {
        const user = await this.userRepository.getByEmail(login.email);

        if (!user) {
            throw new UnauthorizedError('Invalid username or user not found');
        }

        const isPasswordValid = await bcrypt.compare(login.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid password');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!);

        return token;
    }
}