<script lang="ts">
	import type { Component } from 'svelte';
	import type { PageProps } from './$types';

	const modules = import.meta.glob('/posts/**/*.{md,mdx,svx}', { eager: true });

	let { data }: PageProps = $props();

	const postModule = modules[data.postPath];

	if (!postModule) {
		throw new Error(`Post component missing for ${data.postPath}`);
	}

	const { default: Post } = postModule as { default: Component };
	const metadata = (data.metadata ?? {}) as Record<string, unknown>;

	const title = (metadata.title as string | undefined) ?? `${data.slug} – ${data.year}`;
	const description =
		(metadata.metaDescription as string | undefined) ??
		(metadata.description as string | undefined) ??
		(metadata.summary as string | undefined);
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}<meta name="description" content={description} />{/if}
</svelte:head>

<article>
	<h1>{(metadata.title as string | undefined) ?? data.slug}</h1>
	<Post />
</article>
