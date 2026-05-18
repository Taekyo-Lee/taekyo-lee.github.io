// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

const isCompany = import.meta.env.PUBLIC_IS_COMPANY === 'true';
export const SITE_TITLE = isCompany ? 'AI Native 파트 Blog' : "Guru Cat's AI";
export const SITE_DESCRIPTION = 'RF Engineer 출신 AI Engineer의 기록';

// Header/Footer GitHub icon visibility. Flip to true to expose.
export const SHOW_GITHUB_LINK = false;

export const CATEGORY_LABELS: Record<string, string> = {
	'claude-code-101': 'Claude Code 101',
	'harness-engineering': 'Harness Engineering for Claude Code',
	'claude-code-vs-opencode': 'Claude Code vs. OpenCode',
	'about-astro': 'About Astro',
	'about-nodejs': 'About Node.js',
	'lab-notes': 'Lab Notes',
};
