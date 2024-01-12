import * as argon2 from 'argon2';
import prisma from '$lib/prisma';
import type { UserCreateDto } from '$lib/dto/user.dto';

type UserModel = {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	status: number;
};

export default class UserService {
	async create(input: UserCreateDto) {
		try {
			const user = await this.getUserByEmail(input.email);
			if (user) {
				throw new Error('User already exists');
			}

			const hashedPassword = await argon2.hash(input.password);

			return await prisma.user.create({
				data: {
					...input,
					password: hashedPassword
				}
			});
		} catch (error) {
			const msg = `Except create user: ${error.message}`;
			throw new Error(msg);
		}
	}

	async getByEmail(email: string, excludePassword: boolean = false) {
		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (excludePassword) {
			return this.exclude(user, ['password']);
		}

		return user;
	}

	async getCurent(tokenPayload: string) {
		const { email } = JSON.parse(tokenPayload);

		return prisma.user.findUnique({
			where: {
				email
			}
		});
	}

	exclude<UserModel, Key extends keyof UserModel>(
		user: UserModel,
		keys: Key[]
	): Omit<UserModel, Key> {
		return Object.fromEntries(Object.entries(user).filter(([key]) => !keys.includes(key)));
	}
}
