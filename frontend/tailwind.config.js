/** @type {import('tailwindcss').Config} */
export default {
	// darkMode: 'class',
	darkMode: ['class', '[data-theme="dark"]'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['light', 'dark', 'cupcake']
	}
};
