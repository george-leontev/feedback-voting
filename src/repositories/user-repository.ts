import { prisma } from '../app';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user-model';
import { DuplicateEntityError } from '../errors/duplicate-entity-error';


export class UserRepository {
    /**
     * Returns the user by its identifier
     * @param {number} id User identifier
     * @returns {Promise<UserModel>} Object type of UserModel
     */
    async getAsync(id: number): Promise<UserModel> {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        return user as UserModel;
    }

    /**
     * Creates a new user
     * @param user {UserModel}
     * @returns {Promise<UserModel>}
     */
    async createAsync(user: UserModel): Promise<UserModel> {
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
        });

        if (existingUser) {
            throw new DuplicateEntityError('User already exists');
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                ...user,
                password: hashedPassword,
            },
        });

        return newUser;
    };

}
