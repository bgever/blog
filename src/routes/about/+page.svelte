<script lang="ts">
	import clsx from 'clsx';
	import { Container, XIcon, InstagramIcon, GitHubIcon, LinkedInIcon } from '$lib/ui';
	import portraitImage from '$lib/images/portrait.jpg';

	const socialLinks = [
		{ href: '#', icon: XIcon, label: 'Follow on X' },
		{ href: '#', icon: InstagramIcon, label: 'Follow on Instagram' },
		{ href: 'https://github.com/bgever', icon: GitHubIcon, label: 'Follow on GitHub' },
		{ href: '#', icon: LinkedInIcon, label: 'Follow on LinkedIn' }
	];
</script>

<svelte:head>
	<title>About - Bart Verkoeijen</title>
	<meta
		name="description"
		content="I'm Bart Verkoeijen. I live in the digital world, where I design and build the future."
	/>
</svelte:head>

<Container class="mt-16 sm:mt-32">
	<div class="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
		<div class="lg:pl-20">
			<div class="max-w-xs px-2.5 lg:max-w-none">
				<img
					src={portraitImage}
					alt=""
					class="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
				/>
			</div>
		</div>
		<div class="lg:order-first lg:row-span-2">
			<h1 class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
				I'm Bart Verkoeijen. I live in the digital world, where I design and build the future.
			</h1>
			<div class="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
				<p>
					I've loved making things for as long as I can remember, and wrote my first program when I
					was a kid. I spent every waking hour learning about computers, eventually earning my degree
					in computer science.
				</p>
				<p>
					The only thing I loved more than computers as a kid was design. When I was young, I used
					to spend hours drawing and creating, learning about color theory and typography, which
					eventually led me to study design as well.
				</p>
				<p>
					I spent the next several years working at tech companies, learning from the best in the
					industry. I've had the opportunity to work on some amazing projects, from startups to
					large enterprises, always focusing on the intersection of design and technology.
				</p>
				<p>
					Today, I'm working on my own projects, building products that I believe will make a
					difference in people's lives. I'm passionate about creating beautiful, intuitive
					experiences that solve real problems.
				</p>
			</div>
		</div>
		<div class="lg:pl-20">
			<ul role="list">
				{#each socialLinks as link}
					<li class={clsx('flex', socialLinks.indexOf(link) > 0 && 'mt-4')}>
						<a
							href={link.href}
							class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
						>
							<link.icon
								class="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500"
							/>
							<span class="ml-4">{link.label}</span>
						</a>
					</li>
				{/each}
				<li class="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40">
					<a
						href="mailto:hello@bartverkoeijen.com"
						class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500">
							<path
								fill-rule="evenodd"
								d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
							/>
						</svg>
						<span class="ml-4">hello@bartverkoeijen.com</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</Container>
