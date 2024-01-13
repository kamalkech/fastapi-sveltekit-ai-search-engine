import type { UserCreateDto } from '$lib/dto/user.dto';
import prisma from '$lib/prisma';
import UserService from '$lib/services/user.service';

export async function GET() {
	try {
		const userService = new UserService();

		const usersDto: UserCreateDto[] = [
			{
				firstname: 'test1',
				lastname: 'test1',
				email: 'test1@email.com',
				password: 'test1234',
				status: 0
			},
			{
				firstname: 'test2',
				lastname: 'test2',
				email: 'test2@email.com',
				password: 'test1234',
				status: 1
			}
		];

		const users = await Promise.all(
			usersDto.map(async (user) => {
				const newUser = await userService.create(user);
				console.log('newUser', newUser);
				return newUser;
			})
		);

		// const users = await userService.getByEmail('test2@email.com', false);
		console.log('users', users);

		return new Response(JSON.stringify(users), {
			status: 200
		});
	} catch (error: any) {
		return new Response(`Expect test connection with database:  ${error.message}`, {
			status: 500
		});
	}
}
