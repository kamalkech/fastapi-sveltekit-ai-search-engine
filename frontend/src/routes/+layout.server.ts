import type { PageServerLoad } from './$types';
import { loadLocaleAsync } from '../i18n/i18n-util.async';
import { setLocale } from '../i18n/i18n-svelte';

export const load: PageServerLoad = async (event) => {
	const locale = 'en';
	await loadLocaleAsync(locale);
	setLocale(locale);

	console.log('event', event);
	return { msg: 'ok' };
};
