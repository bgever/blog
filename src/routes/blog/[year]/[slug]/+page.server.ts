import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPost, getPostEntries } from '$lib';

export const prerender = true;

export const entries = getPostEntries;

export const load: PageServerLoad = ({ params }) => {
	const post = getPost(params.year, params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return { post };
};
