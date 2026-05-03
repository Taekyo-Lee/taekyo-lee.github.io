// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// Auto-detect deployment target from git remote URL
// Company: github.samsungds.net → isCompany=true
// External: github.com → isCompany=false
import { execSync } from 'node:child_process';
let isCompany = false;
try {
	const remoteUrl = execSync('git remote get-url origin 2>/dev/null', { encoding: 'utf8' }).trim();
	isCompany = remoteUrl.includes('samsungds.net');
} catch {
	// Fallback: env var override (for CI where git remote may differ)
	isCompany = process.env.DEPLOY_TARGET === 'company';
}

// Expose to pages as import.meta.env.PUBLIC_IS_COMPANY
process.env.PUBLIC_IS_COMPANY = String(isCompany);

// https://astro.build/config
export default defineConfig({
	site: isCompany
		? 'https://github.samsungds.net'
		: 'https://taekyo-lee.github.io',
	base: isCompany
		? '/pages/aiagent/ai-native-development-blog/'
		: '/',
	build: {
		assets: isCompany ? 'assets' : '_astro',
	},
	markdown: {
		smartypants: false,  // disable -- → – and --- → — auto-conversion
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
