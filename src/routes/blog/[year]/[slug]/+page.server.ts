import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Component } from 'svelte';

export const prerender = true;

type PostModule = {
	default: Component;
	metadata?: Record<string, unknown>;
};

type PostEntry = {
	year: string;
	slug: string;
	path: string;
	metadata: Record<string, unknown>;
};

const modules = import.meta.glob('/posts/**/*.{md,mdx,svx}', { eager: true });

const posts: PostEntry[] = Object.entries(modules).flatMap(([path, module]) => {
	const match = /\/posts\/(\d{4})\/([^/]+)\.(md|mdx|svx)$/.exec(path);
	if (!match) return [];

	const [, year, slug] = match;
	const { metadata = {} } = module as PostModule;

	return [{ year, slug, path, metadata }];
});

export const entries = () => posts.map(({ year, slug }) => ({ year, slug }));

export const load: PageServerLoad = ({ params }) => {
	const post = posts.find(({ year, slug }) => year === params.year && slug === params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		postPath: post.path,
		metadata: post.metadata,
		year: post.year,
		slug: post.slug
	};
};
