<script lang="ts">
	import type { PageProps } from './$types';
	import clsx from 'clsx';
	import {
		Container,
		Button,
		Card,
		CardTitle,
		CardDescription,
		CardEyebrow,
		CardCta,
		XIcon,
		InstagramIcon,
		GitHubIcon,
		LinkedInIcon
	} from '$lib/ui';

	// Images
	import image1 from '$lib/images/photos/image-1.jpg';
	import image2 from '$lib/images/photos/image-2.jpg';
	import image3 from '$lib/images/photos/image-3.jpg';
	import image4 from '$lib/images/photos/image-4.jpg';
	import image5 from '$lib/images/photos/image-5.jpg';

	// Logos for resume
	import logoPlanetaria from '$lib/images/logos/planetaria.svg';
	import logoAirbnb from '$lib/images/logos/airbnb.svg';
	import logoFacebook from '$lib/images/logos/facebook.svg';
	import logoStarbucks from '$lib/images/logos/starbucks.svg';

	let { data }: PageProps = $props();

	const photos = [image1, image2, image3, image4, image5];
	const rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2'];

	function formatDate(dateString?: string) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	const socialLinks = [
		{ href: '#', label: 'Follow on X', icon: XIcon },
		{ href: '#', label: 'Follow on Instagram', icon: InstagramIcon },
		{ href: 'https://github.com/bgever', label: 'Follow on GitHub', icon: GitHubIcon },
		{ href: '#', label: 'Follow on LinkedIn', icon: LinkedInIcon }
	];

	const resume = [
		{
			company: 'Planetaria',
			title: 'CEO',
			logo: logoPlanetaria,
			start: '2019',
			end: { label: 'Present', dateTime: new Date().getFullYear().toString() }
		},
		{
			company: 'Airbnb',
			title: 'Product Designer',
			logo: logoAirbnb,
			start: '2014',
			end: '2019'
		},
		{
			company: 'Facebook',
			title: 'iOS Software Engineer',
			logo: logoFacebook,
			start: '2011',
			end: '2014'
		},
		{
			company: 'Starbucks',
			title: 'Shift Supervisor',
			logo: logoStarbucks,
			start: '2008',
			end: '2011'
		}
	];
</script>

<svelte:head>
	<title>Bart Verkoeijen - Software designer, founder, and engineer</title>
	<meta
		name="description"
		content="I'm Bart, a software designer and entrepreneur. I build technology that empowers people to do more."
	/>
</svelte:head>

<!-- Hero Section -->
<Container class="mt-9">
	<div class="max-w-2xl">
		<h1 class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
			Software designer, founder, and engineer.
		</h1>
		<p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">
			I'm Bart, a software designer and entrepreneur. I build technology that empowers people to
			explore and create on their own terms.
		</p>
		<div class="mt-6 flex gap-6">
			{#each socialLinks as link}
				<a href={link.href} aria-label={link.label} class="group -m-1 p-1">
					<link.icon
						class="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300"
					/>
				</a>
			{/each}
		</div>
	</div>
</Container>

<!-- Photos Carousel -->
<div class="mt-16 sm:mt-20">
	<div class="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
		{#each photos as photo, index}
			<div
				class={clsx(
					'relative w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800',
					rotations[index % rotations.length]
				)}
			>
				<div class="aspect-[9/10]">
					<img
						src={photo}
						alt=""
						class="absolute inset-0 h-full w-full object-cover"
						loading="lazy"
					/>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Articles and Sidebar -->
<Container class="mt-24 md:mt-28">
	<div class="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
		<!-- Articles -->
		<div class="flex flex-col gap-16">
			{#each data.posts as post (post.href)}
				<Card as="article">
					<CardTitle href={post.href}>
						{post.title}
					</CardTitle>
					<CardEyebrow as="time" datetime={post.date} decorate>
						{formatDate(post.date)}
					</CardEyebrow>
					<CardDescription>
						{post.summary || ''}
					</CardDescription>
					<CardCta>Read article</CardCta>
				</Card>
			{/each}
		</div>

		<!-- Sidebar -->
		<div class="space-y-10 lg:pl-16 xl:pl-24">
			<!-- Newsletter -->
			<form
				action="/thank-you"
				class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
			>
				<h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						class="h-6 w-6 flex-none"
					>
						<path
							d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
							class="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
						/>
						<path
							d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
							class="stroke-zinc-400 dark:stroke-zinc-500"
						/>
					</svg>
					<span class="ml-3">Stay up to date</span>
				</h2>
				<p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
					Get notified when I publish something new, and unsubscribe at any time.
				</p>
				<div class="mt-6 flex items-center">
					<span class="flex min-w-0 flex-auto p-px">
						<input
							type="email"
							placeholder="Email address"
							aria-label="Email address"
							required
							class="w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-teal-500/10 focus:outline-teal-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-teal-400/10 dark:focus:outline-teal-400"
						/>
					</span>
					<Button type="submit" class="ml-4 flex-none">Join</Button>
				</div>
			</form>

			<!-- Resume -->
			<div class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
				<h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						class="h-6 w-6 flex-none"
					>
						<path
							d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
							class="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
						/>
						<path
							d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
							class="stroke-zinc-400 dark:stroke-zinc-500"
						/>
					</svg>
					<span class="ml-3">Work</span>
				</h2>
				<ol class="mt-6 space-y-4">
					{#each resume as role}
						{@const startLabel = typeof role.start === 'string' ? role.start : role.start}
						{@const startDate = typeof role.start === 'string' ? role.start : role.start}
						{@const endLabel = typeof role.end === 'string' ? role.end : role.end.label}
						{@const endDate = typeof role.end === 'string' ? role.end : role.end.dateTime}
						<li class="flex gap-4">
							<div
								class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0"
							>
								<img src={role.logo} alt="" class="h-7 w-7" />
							</div>
							<dl class="flex flex-auto flex-wrap gap-x-2">
								<dt class="sr-only">Company</dt>
								<dd class="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
									{role.company}
								</dd>
								<dt class="sr-only">Role</dt>
								<dd class="text-xs text-zinc-500 dark:text-zinc-400">
									{role.title}
								</dd>
								<dt class="sr-only">Date</dt>
								<dd
									class="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
									aria-label="{startLabel} until {endLabel}"
								>
									<time datetime={startDate}>{startLabel}</time>
									<span aria-hidden="true">—</span>
									<time datetime={endDate}>{endLabel}</time>
								</dd>
							</dl>
						</li>
					{/each}
				</ol>
				<Button href="#" variant="secondary" class="group mt-6 w-full">
					Download CV
					<svg
						viewBox="0 0 16 16"
						fill="none"
						aria-hidden="true"
						class="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50"
					>
						<path
							d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</Button>
			</div>
		</div>
	</div>
</Container>
