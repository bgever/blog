<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	let isOpen = $state(false);

	const navLinks = [
		{ href: '/about', label: 'About' },
		{ href: '/blog', label: 'Articles' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/speaking', label: 'Speaking' },
		{ href: '/uses', label: 'Uses' }
	];

	function toggle() {
		isOpen = !isOpen;
	}

	function close() {
		isOpen = false;
	}
</script>

<div class="pointer-events-auto md:hidden">
	<button
		type="button"
		onclick={toggle}
		class="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20"
	>
		Menu
		<svg
			viewBox="0 0 8 6"
			aria-hidden="true"
			class="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400"
		>
			<path
				d="M1.75 1.75 4 4.25l2.25-2.5"
				fill="none"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>
</div>

{#if isOpen}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-xs dark:bg-black/80"
		transition:fade={{ duration: 150 }}
		onclick={close}
	></div>

	<!-- Panel -->
	<div
		class="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800"
		transition:scale={{ duration: 150, start: 0.95 }}
	>
		<div class="flex flex-row-reverse items-center justify-between">
			<button type="button" aria-label="Close menu" class="-m-1 p-1" onclick={close}>
				<svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6 text-zinc-500 dark:text-zinc-400">
					<path
						d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<h2 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Navigation</h2>
		</div>
		<nav class="mt-6">
			<ul
				class="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300"
			>
				{#each navLinks as link}
					<li>
						<a href={link.href} class="block py-2" onclick={close}>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
{/if}
