<script lang="ts">
	import type { Snippet } from 'svelte';
	import CardLink from './CardLink.svelte';

	interface Props {
		as?: 'h2' | 'h3' | 'h4';
		href?: string;
		children: Snippet;
	}

	let { as = 'h2', href, children }: Props = $props();
</script>

<svelte:element
	this={as}
	class="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100"
>
	{#if href}
		<CardLink {href}>
			{@render children()}
		</CardLink>
	{:else}
		{@render children()}
	{/if}
</svelte:element>
