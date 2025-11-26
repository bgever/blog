<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
		class?: string;
	}

	let { children, class: className, ...rest }: ContainerProps = $props();
</script>

<!-- ContainerOuter -->
<div class={clsx('sm:px-8', className)} {...rest}>
	<div class="mx-auto w-full max-w-7xl lg:px-8">
		<!-- ContainerInner -->
		<div class="relative px-4 sm:px-8 lg:px-12">
			<div class="mx-auto max-w-2xl lg:max-w-5xl">
				{@render children()}
			</div>
		</div>
	</div>
</div>
