// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// Company GitHub Pages deployment: set DEPLOY_TARGET=company
// External (github.com): leave DEPLOY_TARGET unset or set to 'external'
const isCompany = process.env.DEPLOY_TARGET === 'company';

// https://astro.build/config
export default defineConfig({
	site: isCompany
		? 'https://github.samsungds.net'
		: 'https://taekyo-lee.github.io',
	base: isCompany
		? '/pages/aiagent/ai-native-development-blog'
		: '',
	build: {
		assets: isCompany ? 'assets' : '_astro',
	},
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
