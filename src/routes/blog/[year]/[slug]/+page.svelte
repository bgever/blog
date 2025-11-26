<script lang="ts">
	import type { PageProps } from './$types';
	import { getPostModule } from '$lib';
	import { ArticleLayout } from '$lib/ui';

	let { data }: PageProps = $props();

	const postData = getPostModule(data.post.year, data.post.slug);

	if (!postData) {
		throw new Error(`Post component missing for ${data.post.href}`);
	}

	const { module } = postData;
	const { default: Post } = module;
	const { post } = data;

	const title = post.title;
	const description =
		post.metadata.metaDescription ?? post.metadata.description ?? post.summary;
</script>

<svelte:head>
	<title>{title} - Bart Verkoeijen</title>
	{#if description}<meta name="description" content={description} />{/if}
</svelte:head>

<ArticleLayout {title} date={post.date || ''}>
	<Post />
</ArticleLayout>
