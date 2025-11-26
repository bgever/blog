<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
		class?: string;
	}

	let { children, class: className, ...rest }: Props = $props();
</script>

<div class={clsx('prose dark:prose-invert', className)} {...rest}>
	{@render children()}
</div>
