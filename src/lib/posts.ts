import type { Component } from 'svelte';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Raw metadata from post frontmatter.
 * Fields are optional as not all posts have complete metadata.
 */
export type PostMetadata = {
	title?: string;
	summary?: string;
	metaDescription?: string;
	description?: string;
	date?: string;
	author?: string;
	tags?: string[];
	image?: string;
	[key: string]: unknown; // Allow additional custom fields
};

/**
 * A processed post with normalized metadata for listing/display
 */
export type Post = {
	year: string;
	slug: string;
	title: string;
	summary?: string;
	href: string;
	date?: string; // ISO 8601 string
	metadata: PostMetadata; // Full metadata for advanced use cases
};

/**
 * Raw module imported from glob
 */
export type PostModule = {
	default: Component;
	metadata?: PostMetadata;
};

/**
 * Entry format for SvelteKit entries() function
 */
export type PostEntry = {
	year: string;
	slug: string;
};

/**
 * Internal type representing a post with its file path
 */
type PostWithPath = {
	year: string;
	slug: string;
	path: string;
	metadata: PostMetadata;
};

// ============================================================================
// MODULE-LEVEL GLOB IMPORT & CACHE
// ============================================================================

/**
 * Eager glob import of all post files.
 * This runs once at build time (SSG) or module initialization.
 */
const postModules = import.meta.glob<PostModule>('/posts/**/*.{md,md.svelte}', { eager: true });

/**
 * Regex to extract year and slug from post file paths
 */
const POST_PATH_REGEX = /\/posts\/(\d{4})\/([^/]+)\.(md(\.svelte)?)$/;

/**
 * Cached array of all posts with their paths and metadata.
 * Built once at module initialization.
 */
const allPostsCache: PostWithPath[] = Object.entries(postModules).flatMap(([path, module]) => {
	const match = POST_PATH_REGEX.exec(path);
	if (!match) return [];

	const [, year, slug] = match;
	const metadata = module.metadata ?? {};

	return [{ year, slug, path, metadata }];
});

/**
 * Cached array of processed posts (sorted by date descending).
 * Built once at module initialization.
 */
const processedPostsCache: Post[] = allPostsCache
	.map((post) => processPost(post))
	.sort((a, b) => {
		const timeA = a.date ? Date.parse(a.date) : 0;
		const timeB = b.date ? Date.parse(b.date) : 0;
		return timeB - timeA; // Newest first
	});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Processes raw post data into a normalized Post object
 */
function processPost(post: PostWithPath): Post {
	const { year, slug, metadata } = post;

	// Extract title with fallback to slug
	const title = metadata.title ?? slug;

	// Extract summary from multiple possible fields
	const summary = metadata.summary ?? metadata.metaDescription ?? metadata.description;

	// Parse and normalize date to ISO 8601
	const parsedDate = metadata.date ? new Date(metadata.date) : null;
	const isoDate =
		parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : undefined;

	return {
		year,
		slug,
		title,
		summary,
		href: `/blog/${year}/${slug}`,
		date: isoDate,
		metadata
	};
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Returns all posts sorted by date (newest first).
 * Uses cached data from module initialization.
 *
 * @returns Array of all posts with processed metadata
 */
export function getAllPosts(): Post[] {
	return processedPostsCache;
}

/**
 * Returns the N most recent posts.
 *
 * @param count - Number of posts to return (defaults to 3)
 * @returns Array of latest posts
 */
export function getLatestPosts(count: number = 3): Post[] {
	return processedPostsCache.slice(0, count);
}

/**
 * Finds a specific post by year and slug.
 *
 * @param year - Post year (e.g., "2021")
 * @param slug - Post slug (e.g., "hello-world-again")
 * @returns Post object or undefined if not found
 */
export function getPost(year: string, slug: string): Post | undefined {
	return processedPostsCache.find((post) => post.year === year && post.slug === slug);
}

/**
 * Returns post entries for SvelteKit's entries() function.
 * Used for static site generation (SSG) to define all routes.
 *
 * @returns Array of { year, slug } objects
 */
export function getPostEntries(): PostEntry[] {
	return allPostsCache.map(({ year, slug }) => ({ year, slug }));
}

/**
 * Returns the raw post module (component + metadata) for a specific post.
 * This is needed for client-side rendering where the component itself is used.
 *
 * @param year - Post year
 * @param slug - Post slug
 * @returns Object with path and module, or undefined if not found
 */
export function getPostModule(
	year: string,
	slug: string
): { path: string; module: PostModule } | undefined {
	const post = allPostsCache.find((p) => p.year === year && p.slug === slug);
	if (!post) return undefined;

	const module = postModules[post.path];
	if (!module) return undefined;

	return { path: post.path, module };
}

/**
 * Returns the raw post modules map.
 * Use this sparingly - prefer getPostModule() for specific posts.
 *
 * @returns Record of all post module paths to modules
 */
export function getPostModules(): Record<string, PostModule> {
	return postModules;
}
