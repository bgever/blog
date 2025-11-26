<script lang="ts">
	import type { Snippet } from 'svelte';
	import FooterNew from './FooterNew.svelte';
	import HeaderNew from './HeaderNew.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<!-- Fixed background panel -->
<div class="fixed inset-0 flex justify-center sm:px-8">
	<div class="flex w-full max-w-7xl lg:px-8">
		<div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20"></div>
	</div>
</div>

<!-- Main content -->
<div class="relative flex w-full flex-col">
	<HeaderNew />
	<main class="flex-auto">
		{@render children()}
	</main>
	<FooterNew />
</div>
