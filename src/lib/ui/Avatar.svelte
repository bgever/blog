<script lang="ts">
	import clsx from 'clsx';
	import avatarImage from '$lib/images/avatar.jpg';

	interface Props {
		large?: boolean;
		class?: string;
		style?: string;
	}

	let { large = false, class: className, style }: Props = $props();
</script>

<a href="/" aria-label="Home" class={clsx('pointer-events-auto', className)} {style}>
	<img
		src={avatarImage}
		alt=""
		class={clsx(
			'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
			large ? 'h-16 w-16' : 'h-9 w-9'
		)}
	/>
</a>
