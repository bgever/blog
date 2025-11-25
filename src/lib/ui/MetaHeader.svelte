<script>
	console.log('MetaHeader loaded');
	const { content } = $props();
</script>

<svelte:head>
	<meta name="test" {content} />
</svelte:head>
