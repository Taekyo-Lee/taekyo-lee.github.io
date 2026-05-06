import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

type BlogEntry = CollectionEntry<'blog'>;

/**
 * Returns blog posts that should be visible in the current build.
 * Drafts (frontmatter `draft: true`) are hidden in production but visible in dev.
 */
export async function getVisibleBlogPosts(
	filter?: (entry: BlogEntry) => boolean,
): Promise<BlogEntry[]> {
	const all = await getCollection('blog', (entry) => {
		if (import.meta.env.PROD && entry.data.draft) return false;
		return filter ? filter(entry) : true;
	});
	return all;
}
