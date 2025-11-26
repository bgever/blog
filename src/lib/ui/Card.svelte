<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		as?: 'div' | 'article';
		children: Snippet;
		class?: string;
	}

	let { as = 'div', children, class: className, ...rest }: Props = $props();
</script>

<svelte:element
	this={as}
	class={clsx('group relative flex flex-col items-start', className)}
	{...rest}
>
	{@render children()}
</svelte:element>
