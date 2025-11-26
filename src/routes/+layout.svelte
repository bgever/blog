<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Layout } from '$lib/ui';
	import { theme } from '$lib/stores/theme.svelte';

	let { children } = $props();

	// Initialize theme on mount
	$effect(() => {
		// Force re-read to trigger the effect in the store
		theme.current;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content={theme.current === 'dark' ? '#18181b' : '#ffffff'} />
</svelte:head>

<div class="min-h-screen bg-zinc-50 dark:bg-black">
	<Layout>
		{@render children()}
	</Layout>
</div>
