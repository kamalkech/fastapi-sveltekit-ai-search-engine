import { loadTranslations } from '$lib/translations';

export const load = async (event) => {
	const initialLocale = 'ar'; // get from cookie / url / fetch from server...
	// const initialLocale = cookies.get('lng') ?? 'ar';
	console.log('cookies', await event);

	await loadTranslations(initialLocale); // keep this just before the `return`

	return {};
};
