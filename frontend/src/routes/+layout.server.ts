import { locales, loadTranslations, defaultLocale } from '$lib/translations';

export const load = async ({ url, cookies, request }) => {
	const { pathname } = url;

	// Try to get the locale from cookie
	let locale = (cookies.get('lng') || '').toLowerCase();

	// Get user preferred locale
	if (!locale) {
		locale = `${`${request.headers.get('accept-language')}`.match(
			/[a-zA-Z]+?(?=-|_|,|;)/
		)}`.toLowerCase();
	}

	// Get defined locales
	const supportedLocales = locales.get().map((l) => l.toLowerCase());

	// Use default locale if current locale is not supported
	if (!supportedLocales.includes(locale)) {
		locale = defaultLocale;
	}

	await loadTranslations(locale, pathname); // keep this just before the `return`

	return {
		i18n: { locale, route: pathname }
	};
};
