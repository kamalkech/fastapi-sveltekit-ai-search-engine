import { THEMES } from '$lib/config';
import { JWT_ACCESS_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';
import prisma from '$lib/prisma';

export const handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme');
	const authCookie = event.cookies.get('zeia_token');

	if (authCookie) {
		const token = authCookie.split(' ')[1];

		try {
			const jwtUser = jwt.verify(token, JWT_ACCESS_SECRET);
			if (typeof jwtUser === 'string') {
				throw new Error('Something went wrong');
			}

			const user = await prisma.user.findUnique({
				where: {
					id: jwtUser.id
				}
			});

			if (!user) {
				throw new Error('User not found');
			}

			const sessionUser = {
				id: user.id,
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname
			};

			event.locals.user = sessionUser;
		} catch (error) {
			console.error(error);
		}
	}

	if (!theme || !Object.values(THEMES).includes(theme)) {
		return await resolve(event);
	}

	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('data-theme=""', `data-theme="${theme}"`);
		}
	});
};
