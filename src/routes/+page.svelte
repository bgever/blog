<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const formatDate = (iso?: string) => {
		if (!iso) return '';
		const date = new Date(iso);
		return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
	};
</script>

<main>
	<section>
		<h1>Latest posts</h1>
		{#if data.posts.length === 0}
			<p>No posts yet. Check back soon.</p>
		{:else}
			{#each data.posts as post (post.href)}
				<article>
					<h2><a href={post.href}>{post.title}</a></h2>
					{#if post.date}
						<p><time datetime={post.date}>{formatDate(post.date)}</time></p>
					{/if}
					{#if post.summary}<p>{post.summary}</p>{/if}
				</article>
			{/each}
		{/if}
	</section>
</main>
