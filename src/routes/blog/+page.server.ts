import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib';

export const load: PageServerLoad = async () => ({
	posts: getAllPosts()
});

export const prerender = true;
