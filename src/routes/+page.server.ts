import type { PageServerLoad } from './$types';
import { getLatestPosts } from '$lib';

export const load: PageServerLoad = async () => ({
	posts: getLatestPosts(3)
});

export const prerender = true;
