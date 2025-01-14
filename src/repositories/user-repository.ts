import { prisma } from '../app';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user-model';
import { DuplicateEntityError } from '../errors/duplicate-entity-error';

/**
 * UserRepository is responsible for interacting with the users data in the database.
 * It provides methods to get by id and create user. Also this repostory can get user by his unique email.
 */
export class UserRepository {

    async getAsync(id: number): Promise<UserModel | null> {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        return user ? user as UserModel : user; // Returns casted to UserModel user if found and null otherwise
    }

    async getByEmail(email: string): Promise<UserModel | null> {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        return user ? user as UserModel : user;  // Returns casted to UserModel user if found and null otherwise
    }

    /**
     * Creates a new user in the database
     * @param {UserModel} user - The user object containing user info.
     * @throws {DuplicateEntityError} - Throws an error if the user already exists.
     * @returns {Promise<UserModel>} Returns the created user object.
     */
    async createAsync(user: UserModel): Promise<UserModel> {
        // Check for existing user by email
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
        });

        if (existingUser) {
            throw new DuplicateEntityError('User already exists');
        }

        // Hash the user's password before storing
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        // Create and return the new user with hashed password
        const newUser = await prisma.user.create({
            data: {
                ...user,
                password: hashedPassword,
            },
        });

        return newUser;
    };
}
