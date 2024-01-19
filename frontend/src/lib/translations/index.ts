import i18n from 'sveltekit-i18n';
import lang from './lang.json';

export const defaultLocale = 'en';

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
		},
		{
			locale: 'en',
			key: 'footer',
			loader: async () => (await import('./en/footer.json')).default
		},
		{
			locale: 'ar',
			key: 'footer',
			loader: async () => (await import('./ar/footer.json')).default
		},
		{
			locale: 'en',
			key: 'form',
			loader: async () => (await import('./en/form.json')).default
		},
		{
			locale: 'ar',
			key: 'form',
			loader: async () => (await import('./ar/form.json')).default
		}
	]
};

export const {
	t,
	loading,
	locales,
	locale,
	translations,
	loadTranslations,
	addTranslations,
	setLocale,
	setRoute
} = new i18n(config);

// loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
