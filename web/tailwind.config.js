/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				print: { raw: 'print' },
				screen: { raw: 'screen' }
			}
		}
	},
	plugins: []
};
