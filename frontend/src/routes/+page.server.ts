import type { PageServerLoad } from './$types';
import { redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = event.locals?.user;

	return {
		user
	};
};

export const actions: Actions = {
	logout: async (event) => {
		event.cookies.delete('zeia_token', {
			path: '/'
		});

		throw redirect(302, '/');
	},

	setTheme: async ({ url, cookies }) => {
		const theme = url.searchParams.get('theme');
		const redirectTo = url.searchParams.get('redirectTo');

		if (theme) {
			cookies.set('theme', theme, {
				httpOnly: true,
				path: '/',
				secure: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 365
			});
		}

		throw redirect(303, redirectTo ?? '/');
	}
};
