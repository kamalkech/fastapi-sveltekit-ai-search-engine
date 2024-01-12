import { JWT_ACCESS_SECRET } from '$env/static/private';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import prisma from '$lib/prisma';

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
				// return {
				// 	error: 'Invalid credentials'
				// };
				throw new Error('Invalid credentials');
			}

			// Verify the password
			const passwordIsValid = await argon2.verify(user.password, password);

			if (!passwordIsValid) {
				// return {
				// 	error: 'Invalid credentials'
				// };
				throw new Error('Invalid credentials');
			}

			const jwtUser = {
				id: user.id,
				email: user.email
			};

			const token = jwt.sign(jwtUser, JWT_ACCESS_SECRET, {
				expiresIn: '1d'
			});

			return { token };
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async signup(input: UserCreateDto) {}
}
