<script lang="ts">
	import { SimpleLayout } from '$lib/ui';

	const toolCategories = [
		{
			title: 'Workstation',
			tools: [
				{
					title: '16" MacBook Pro, M3 Max, 64GB RAM (2023)',
					description:
						"I was using an Intel-based 16\" MacBook Pro prior to this and the difference is night and day. I've never heard the fans turn on a single time, even under the incredibly heavy loads I put it through."
				},
				{
					title: 'Apple Pro Display XDR (Standard Glass)',
					description:
						"The only display on the market with the resolution and color accuracy I need for design work. When you're spending all day looking at a screen, it's worth investing in a good one."
				},
				{
					title: 'Apple Magic Keyboard',
					description:
						'Something about all the keys having the same height and not having a numpad makes it easier for me to touch type.'
				},
				{
					title: 'Apple Magic Trackpad',
					description:
						'Something about all that precision and those buttery gestures makes it worth the money.'
				},
				{
					title: 'Herman Miller Aeron Chair',
					description:
						"If I'm going to slouch in the worst posture imaginable all day, I might as well do it in an expensive chair."
				}
			]
		},
		{
			title: 'Development tools',
			tools: [
				{
					title: 'VS Code',
					description:
						"I've tried every editor out there, and VS Code is the one I keep coming back to. The extension ecosystem is unmatched."
				},
				{
					title: 'iTerm2',
					description:
						"I'm honestly not even sure what features I get with this that aren't in the built-in Terminal, but I've been using it for so long I'm afraid to switch."
				},
				{
					title: 'TablePlus',
					description:
						'Great software for working with databases. Has saved me from mass-destroying data on many occasions.'
				}
			]
		},
		{
			title: 'Design',
			tools: [
				{
					title: 'Figma',
					description:
						"I started using Figma as just a design tool but now it's become my virtual whiteboard for everything. Never would have expected the empty canvas to be the thing that makes me most productive."
				}
			]
		},
		{
			title: 'Productivity',
			tools: [
				{
					title: 'Alfred',
					description:
						"It's not the newest kid on the block but it's still the fastest. The Alarm feature is like a superpower for me."
				},
				{
					title: 'Reflect',
					description:
						"Using a notes app shouldn't be rocket science and Reflect is finally the one that feels light and fast enough to not get in my way."
				},
				{
					title: 'Focus',
					description:
						'Simple tool for blocking distracting websites. I love being able to schedule custom blocking sessions when I know I need to buckle down.'
				}
			]
		}
	];
</script>

<svelte:head>
	<title>Uses - Bart Verkoeijen</title>
	<meta
		name="description"
		content="Software I use, gadgets I love, and other things I recommend."
	/>
</svelte:head>

<SimpleLayout
	title="Software I use, gadgets I love, and other things I recommend."
	intro="I get asked a lot about the things I use to build software, stay productive, or buy to fool myself into thinking I'm being productive when I'm really just procrastinating. Here's a big list of all of my favorite stuff."
>
	<div class="space-y-20">
		{#each toolCategories as category}
			<section>
				<h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
					{category.title}
				</h2>
				<ul role="list" class="mt-6 space-y-8">
					{#each category.tools as tool}
						<li class="flex items-start">
							<div class="relative flex h-8 w-8 flex-none items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
								<span class="h-4 w-4 rounded-full bg-zinc-200 dark:bg-zinc-700"></span>
							</div>
							<dl class="ml-4 flex flex-auto flex-col">
								<dt class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
									{tool.title}
								</dt>
								<dd class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
									{tool.description}
								</dd>
							</dl>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</SimpleLayout>
