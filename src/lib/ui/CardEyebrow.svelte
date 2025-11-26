<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		as?: 'p' | 'time' | 'span';
		decorate?: boolean;
		children: Snippet;
		class?: string;
	}

	let { as = 'p', decorate = false, children, class: className, ...rest }: Props = $props();
</script>

<svelte:element
	this={as}
	class={clsx(
		'relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500',
		decorate && 'pl-3.5',
		className
	)}
	{...rest}
>
	{#if decorate}
		<span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
			<span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
		</span>
	{/if}
	{@render children()}
</svelte:element>
