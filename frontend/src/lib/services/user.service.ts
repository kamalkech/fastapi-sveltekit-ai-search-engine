import * as argon2 from 'argon2';
import prisma from '$lib/prisma';
import type { UserCreateDto, UserUpdateDto } from '$lib/dto/user.dto';
import type { LanguageListEnum } from '$lib/enums';

export default class UserService {
	async create(input: UserCreateDto) {
		try {
			const user = await this.getByEmail(input.email);
			if (user) {
				throw new Error('User already exists');
			}

			const hashedPassword = await argon2.hash(input.password);

			return await prisma.user.create({
				data: {
					firstname: input.firstname,
					lastname: input.lastname,
					email: input.email,
					password: hashedPassword,
					code: input.code,
					status: 0,
					language: 'en'
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

	async updateLanguage(id: number, language: LanguageListEnum) {
		return await prisma.user.update({
			where: {
				id
			},
			data: {
				language
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
