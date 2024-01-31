import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = (event) => {
	const user = event.locals.user;
	console.log('user', user);

	if (!user) {
		// throw error(401, {
		// 	message: 'You must be logged in to view this page'
		// });
		throw redirect(302, '/');
	}

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
