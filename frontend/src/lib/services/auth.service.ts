import { JWT_ACCESS_SECRET } from '$env/static/private';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import prisma from '$lib/prisma';
import type { UserCreateDto } from '$lib/dto';
import UserService from './user.service';
import { HelperService, MailService } from '.';
import { htmlActivateAccount } from '$lib/mail-template';

export class AuthService {
	async singin(email: string, password: string) {
		try {
			// Check if user exists
			const user = await prisma.user.findUnique({
				where: {
					email
				}
			});

			if (!user) {
				throw new Error('Invalid credentials');
			}

			// Verify the password
			const passwordIsValid = await argon2.verify(user.password, password);

			if (!passwordIsValid) {
				throw new Error('Invalid credentials');
			}

			const jwtUser = {
				id: user.id,
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname
			};

			const token = jwt.sign(jwtUser, JWT_ACCESS_SECRET, {
				expiresIn: '1d'
			});

			return { token };
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async signup(input: UserCreateDto): Promise<any> {
		// Check if user exists
		const user = await prisma.user.findUnique({
			where: {
				email: input.email
			}
		});

		if (user) {
			throw new Error('This email is already in use');
		}

		// Create user.
		const userService = new UserService();
		const mailService = new MailService();
		const helperService = new HelperService();

		const newUser = await userService.create(input);
		const code_activation = helperService.generateActivationCode();

		// Send mail to activate account.
		await mailService.sendMail(
			newUser.email,
			'Zeia | Account Activation',
			htmlActivateAccount(code_activation)
		);

		return newUser;
	}
}
