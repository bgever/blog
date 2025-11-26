<script lang="ts">
	import { SimpleLayout, Card, CardTitle, CardDescription, CardEyebrow, CardCta } from '$lib/ui';

	const speakingEngagements = [
		{
			title: 'In space, no one can hear you scream',
			description:
				'A technical deep-dive into the challenges of building software for space exploration.',
			event: 'SysConf 2024',
			cta: 'Watch video',
			href: '#'
		},
		{
			title: 'Lessons learned from scaling to millions of users',
			description:
				'How we scaled our platform from thousands to millions of users while maintaining performance.',
			event: 'Business of Software 2023',
			cta: 'Watch video',
			href: '#'
		},
		{
			title: 'The future of web development',
			description:
				'Exploring the latest trends and technologies shaping the future of web development.',
			event: 'ComponentsConf 2023',
			cta: 'Watch video',
			href: '#'
		}
	];

	const podcasts = [
		{
			title: 'Using design as a competitive advantage',
			description:
				'How we use design to differentiate ourselves in a crowded market.',
			event: 'Encoding Design, July 2023',
			cta: 'Listen to podcast',
			href: '#'
		},
		{
			title: 'Bootstrapping a multi-million dollar business',
			description:
				'The story of how we bootstrapped our company to profitability.',
			event: 'The Indie Hackers Podcast, March 2023',
			cta: 'Listen to podcast',
			href: '#'
		},
		{
			title: 'The art of programming',
			description:
				'The intersection of creativity and code, and why programming is an art form.',
			event: 'The Stack Overflow Podcast, September 2022',
			cta: 'Listen to podcast',
			href: '#'
		}
	];
</script>

<svelte:head>
	<title>Speaking - Bart Verkoeijen</title>
	<meta
		name="description"
		content="I've spoken at events all around the world and been interviewed for many podcasts."
	/>
</svelte:head>

<SimpleLayout
	title="I've spoken at events all around the world and been interviewed for many podcasts."
	intro="One of my favorite ways to share my ideas is live on stage, where there's so much more opportunity for interaction with the audience. I also enjoy being interviewed for podcasts, where I can share my thoughts in a more conversational format."
>
	<div class="space-y-20">
		<section>
			<h2 class="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="h-6 w-6 flex-none fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
				>
					<path d="M2 9.5V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
					<path d="M2 19.5V14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
				</svg>
				<span class="ml-3">Conferences</span>
			</h2>
			<ol class="mt-6 space-y-6">
				{#each speakingEngagements as engagement}
					<Card as="li">
						<CardTitle as="h3" href={engagement.href}>{engagement.title}</CardTitle>
						<CardEyebrow decorate>{engagement.event}</CardEyebrow>
						<CardDescription>{engagement.description}</CardDescription>
						<CardCta>{engagement.cta}</CardCta>
					</Card>
				{/each}
			</ol>
		</section>
		<section>
			<h2 class="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="h-6 w-6 flex-none fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
				>
					<path d="M12 14.25a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5Z" />
					<path d="M12 14.25v8" />
					<path d="M16 18.25h-8" />
				</svg>
				<span class="ml-3">Podcasts</span>
			</h2>
			<ol class="mt-6 space-y-6">
				{#each podcasts as podcast}
					<Card as="li">
						<CardTitle as="h3" href={podcast.href}>{podcast.title}</CardTitle>
						<CardEyebrow decorate>{podcast.event}</CardEyebrow>
						<CardDescription>{podcast.description}</CardDescription>
						<CardCta>{podcast.cta}</CardCta>
					</Card>
				{/each}
			</ol>
		</section>
	</div>
</SimpleLayout>
