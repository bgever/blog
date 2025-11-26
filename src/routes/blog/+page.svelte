<script lang="ts">
	import type { PageProps } from './$types';
	import {
		SimpleLayout,
		Card,
		CardTitle,
		CardDescription,
		CardEyebrow,
		CardCta
	} from '$lib/ui';

	let { data }: PageProps = $props();

	function formatDate(dateString?: string) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Articles - Bart Verkoeijen</title>
	<meta
		name="description"
		content="All of my long-form thoughts on programming, design, and more, collected in chronological order."
	/>
</svelte:head>

<SimpleLayout
	title="Writing on software design, programming, and more."
	intro="All of my long-form thoughts on programming, design, product development, and more, collected in chronological order."
>
	<div class="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
		<div class="flex max-w-3xl flex-col space-y-16">
			{#each data.posts as post (post.href)}
				<article class="md:grid md:grid-cols-4 md:items-baseline">
					<Card class="md:col-span-3">
						<CardTitle href={post.href}>
							{post.title}
						</CardTitle>
						<CardEyebrow as="time" datetime={post.date} class="md:hidden" decorate>
							{formatDate(post.date)}
						</CardEyebrow>
						<CardDescription>
							{post.summary || ''}
						</CardDescription>
						<CardCta>Read article</CardCta>
					</Card>
					<CardEyebrow as="time" datetime={post.date} class="mt-1 max-md:hidden">
						{formatDate(post.date)}
					</CardEyebrow>
				</article>
			{/each}
		</div>
	</div>
</SimpleLayout>
