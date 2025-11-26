<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<p class="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
	{@render children()}
</p>
