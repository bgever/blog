<script lang="ts">
	import { page } from '$app/state';
	import clsx from 'clsx';
	import Avatar from './Avatar.svelte';
	import MobileNav from './MobileNav.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const navLinks = [
		{ href: '/about', label: 'About' },
		{ href: '/blog', label: 'Articles' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/speaking', label: 'Speaking' },
		{ href: '/uses', label: 'Uses' }
	];

	let headerRef: HTMLDivElement | undefined = $state();
	let avatarRef: HTMLDivElement | undefined = $state();
	let isInitial = $state(true);

	const isHomePage = $derived(page.url.pathname === '/');

	// CSS custom properties for scroll-based animations
	let headerPosition = $state('sticky');
	let headerInnerPosition = $state<string | undefined>(undefined);
	let headerHeight = $state<string | undefined>(undefined);
	let headerMb = $state<string | undefined>(undefined);
	let headerTop = $state('0px');
	let avatarTop = $state('0px');
	let contentOffset = $state<string | undefined>(undefined);
	let avatarImageTransform = $state<string | undefined>(undefined);
	let avatarBorderTransform = $state<string | undefined>(undefined);
	let avatarBorderOpacity = $state('0');

	function clamp(number: number, a: number, b: number) {
		const min = Math.min(a, b);
		const max = Math.max(a, b);
		return Math.min(Math.max(number, min), max);
	}

	$effect(() => {
		if (typeof window === 'undefined') return;

		const downDelay = avatarRef?.offsetTop ?? 0;
		const upDelay = 64;

		function updateHeaderStyles() {
			if (!headerRef) return;

			const { top, height } = headerRef.getBoundingClientRect();
			const scrollY = clamp(window.scrollY, 0, document.body.scrollHeight - window.innerHeight);

			if (isInitial) {
				headerPosition = 'sticky';
			}

			contentOffset = `${downDelay}px`;

			if (isInitial || scrollY < downDelay) {
				headerHeight = `${downDelay + height}px`;
				headerMb = `${-downDelay}px`;
			} else if (top + height < -upDelay) {
				const offset = Math.max(height, scrollY - upDelay);
				headerHeight = `${offset}px`;
				headerMb = `${height - offset}px`;
			} else if (top === 0) {
				headerHeight = `${scrollY + height}px`;
				headerMb = `${-scrollY}px`;
			}

			if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
				headerInnerPosition = 'fixed';
				headerTop = '';
				avatarTop = '';
			} else {
				headerInnerPosition = undefined;
				headerTop = '0px';
				avatarTop = '0px';
			}
		}

		function updateAvatarStyles() {
			if (!isHomePage) return;

			const downDelay = avatarRef?.offsetTop ?? 0;
			const fromScale = 1;
			const toScale = 36 / 64;
			const fromX = 0;
			const toX = 2 / 16;

			const scrollY = downDelay - window.scrollY;

			let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
			scale = clamp(scale, fromScale, toScale);

			let x = (scrollY * (fromX - toX)) / downDelay + toX;
			x = clamp(x, fromX, toX);

			avatarImageTransform = `translate3d(${x}rem, 0, 0) scale(${scale})`;

			const borderScale = 1 / (toScale / scale);
			const borderX = (-toX + x) * borderScale;
			avatarBorderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`;
			avatarBorderOpacity = scale === toScale ? '1' : '0';
		}

		function updateStyles() {
			updateHeaderStyles();
			updateAvatarStyles();
			isInitial = false;
		}

		updateStyles();
		window.addEventListener('scroll', updateStyles, { passive: true });
		window.addEventListener('resize', updateStyles);

		return () => {
			window.removeEventListener('scroll', updateStyles);
			window.removeEventListener('resize', updateStyles);
		};
	});
</script>

<header
	class="pointer-events-none relative z-50 flex flex-none flex-col"
	style:height={headerHeight}
	style:margin-bottom={headerMb}
>
	{#if isHomePage}
		<div bind:this={avatarRef} class="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]">
		</div>
		<div
			class="sm:px-8 top-0 order-last -mb-3 pt-3"
			style:position={headerPosition}
		>
			<div class="mx-auto w-full max-w-7xl lg:px-8">
				<div
					class="relative px-4 sm:px-8 lg:px-12"
				>
					<div class="mx-auto max-w-2xl lg:max-w-5xl">
						<div
							class="top-3 w-full"
							style:position={headerInnerPosition}
							style:top={avatarTop ? `var(--avatar-top, ${avatarTop})` : undefined}
						>
							<div class="relative">
								<div
									class="absolute top-3 left-0 origin-left h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm transition-opacity dark:bg-zinc-800/90 dark:ring-white/10"
									style:opacity={avatarBorderOpacity}
									style:transform={avatarBorderTransform}
								></div>
								<Avatar
									large
									class="block h-16 w-16 origin-left"
									style="transform: {avatarImageTransform}"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
	<div
		bind:this={headerRef}
		class="top-0 z-10 h-16 pt-6"
		style:position={headerPosition}
	>
		<div
			class="sm:px-8 top-6 w-full"
			style:position={headerInnerPosition}
			style:top={headerTop ? `var(--header-top, ${headerTop})` : undefined}
		>
			<div class="mx-auto w-full max-w-7xl lg:px-8">
				<div class="relative px-4 sm:px-8 lg:px-12">
					<div class="mx-auto max-w-2xl lg:max-w-5xl">
						<div class="relative flex gap-4">
							<div class="flex flex-1">
								{#if !isHomePage}
									<div
										class="h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10"
									>
										<Avatar />
									</div>
								{/if}
							</div>
							<div class="flex flex-1 justify-end md:justify-center">
								<MobileNav />
								<nav class="pointer-events-auto hidden md:block">
									<ul
										class="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
									>
										{#each navLinks as link}
											<li>
												<a
													href={link.href}
													class={clsx(
														'relative block px-3 py-2 transition',
														page.url.pathname === link.href
															? 'text-teal-500 dark:text-teal-400'
															: 'hover:text-teal-500 dark:hover:text-teal-400'
													)}
												>
													{link.label}
													{#if page.url.pathname === link.href}
														<span
															class="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0"
														></span>
													{/if}
												</a>
											</li>
										{/each}
									</ul>
								</nav>
							</div>
							<div class="flex justify-end md:flex-1">
								<div class="pointer-events-auto">
									<ThemeToggle />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>
{#if isHomePage}
	<div class="flex-none" style:height={contentOffset}></div>
{/if}
