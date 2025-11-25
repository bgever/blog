import type { PageServerLoad } from './$types';

type PostMeta = {
	title?: string;
	summary?: string;
	metaDescription?: string;
	description?: string;
	date?: string;
};

type Post = {
	title: string;
	summary?: string;
	href: string;
	date?: string;
};

const modules = import.meta.glob('/posts/**/*.{md,mdx,svx}', { eager: true });

const allPosts: Post[] = Object.entries(modules).flatMap(([path, mod]) => {
	const match = /\/posts\/(\d{4})\/([^/]+)\.(md|mdx|svx)$/.exec(path);
	if (!match) return [];

	const [, year, slug] = match;
	const { metadata = {} } = mod as { metadata?: PostMeta };

	const title = metadata.title ?? slug;
	const summary = metadata.summary ?? metadata.metaDescription ?? metadata.description;

	const parsedDate = metadata.date ? new Date(metadata.date) : null;
	const isoDate = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : undefined;

	return [
		{
			title,
			summary,
			href: `/blog/${year}/${slug}`,
			date: isoDate
		}
	];
});

const latestPosts = allPosts
	.toSorted((a, b) => {
		const timeA = a.date ? Date.parse(a.date) : 0;
		const timeB = b.date ? Date.parse(b.date) : 0;
		return timeB - timeA;
	})
	.slice(0, 3);

export const load: PageServerLoad = async () => ({
	posts: latestPosts
});
export const prerender = true;
