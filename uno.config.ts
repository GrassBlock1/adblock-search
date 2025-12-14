import { defineConfig, presetIcons } from 'unocss';
import { presetWind3 } from 'unocss';


export default defineConfig({
	presets: [
		presetWind3(),
		presetIcons({
			scale: 1.2,
			cdn: 'https://esm.sh/'
		})
	],
	theme: {
		colors: {
			primary: {
				light: '#3b82f6',
				dark: '#60a5fa'
			}
		}
	}
});
