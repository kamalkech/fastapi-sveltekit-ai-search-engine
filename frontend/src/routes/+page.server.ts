import type { PageServerLoad } from './$types';
import { redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = (event) => {
	const user = event.locals.user;

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
	}
};
