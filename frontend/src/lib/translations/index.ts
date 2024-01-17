import i18n from 'sveltekit-i18n';
import lang from './lang.json';

/** @type {import('sveltekit-i18n').Config} */
export const config = {
	translations: {
		en: { lang },
		ar: { lang }
	},
	loaders: [
		{
			locale: 'en',
			key: 'menu',
			loader: async () => (await import('./en/menu.json')).default
		},
		{
			locale: 'ar',
			key: 'menu',
			loader: async () => (await import('./ar/menu.json')).default
		},
		{
			locale: 'en',
			key: 'circle',
			loader: async () => (await import('./en/circle.json')).default
		},
		{
			locale: 'ar',
			key: 'circle',
			loader: async () => (await import('./ar/circle.json')).default
		}
	]
};

export const { t, loading, locales, locale, loadTranslations } = new i18n(config);

// loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
