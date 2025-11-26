<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary';

	type BaseProps = {
		variant?: Variant;
		class?: string;
		children: Snippet;
	};

	type ButtonProps = BaseProps &
		HTMLAttributes<HTMLButtonElement> & {
			href?: never;
		};

	type AnchorProps = BaseProps &
		HTMLAnchorAttributes & {
			href: string;
		};

	type Props = ButtonProps | AnchorProps;

	let { variant = 'primary', class: className, children, href, ...rest }: Props = $props();

	const variantStyles: Record<Variant, string> = {
		primary:
			'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70',
		secondary:
			'bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70'
	};

	const baseStyles =
		'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none';
</script>

{#if href}
	<a {href} class={clsx(baseStyles, variantStyles[variant], className)} {...rest}>
		{@render children()}
	</a>
{:else}
	<button class={clsx(baseStyles, variantStyles[variant], className)} {...rest}>
		{@render children()}
	</button>
{/if}
