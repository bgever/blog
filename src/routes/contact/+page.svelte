<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { SimpleLayout, Button } from '$lib/ui';

	// Form data state
	let formData = $state({
		name: '',
		email: '',
		message: ''
	});

	// UI state
	let submitting = $state(false);
	let touched = $state({
		name: false,
		email: false,
		message: false
	});

	// Derived validation state
	let emailValid = $derived(
		!formData.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
	);

	let formValid = $derived(
		formData.name.trim() !== '' &&
			formData.email.trim() !== '' &&
			emailValid &&
			formData.message.trim() !== ''
	);

	// Only access searchParams in browser
	let showSuccess = $derived(browser && $page.url.searchParams.get('success') === 'true');

	// Event handlers
	function handleBlur(field: 'name' | 'email' | 'message') {
		touched[field] = true;
	}

	function handleInput(field: 'name' | 'email' | 'message') {
		// Clear touched state when user starts correcting and field becomes valid
		if (touched[field]) {
			if (field === 'email' && emailValid) {
				touched[field] = false;
			} else if (field !== 'email' && formData[field].trim() !== '') {
				touched[field] = false;
			}
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!formValid) {
			return;
		}

		submitting = true;

		try {
			const form = event.target as HTMLFormElement;
			const formDataToSend = new FormData(form);

			const response = await fetch('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams(formDataToSend as any).toString()
			});

			if (response.ok) {
				// Reset form
				formData.name = '';
				formData.email = '';
				formData.message = '';
				touched.name = false;
				touched.email = false;
				touched.message = false;

				// Redirect to show success message
				goto('/contact?success=true');
			}
		} catch (err) {
			console.error('Form submission error:', err);
		} finally {
			submitting = false;
		}
	}

	// Email validation pattern from Eleventy form
	const emailPattern =
		'^([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x22([^\\x0d\\x22\\x5c\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x22)(\\x2e([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x22([^\\x0d\\x22\\x5c\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x22))*\\x40([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x5b([^\\x0d\\x5b-\\x5d\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x5d)(\\x2e([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x5b([^\\x0d\\x5b-\\x5d\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x5d))*(\\x2e\\w{2,})+$';

	const inputStyles =
		'w-full appearance-none rounded-md bg-white px-4 py-3 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-teal-500/10 focus:outline-teal-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-teal-400/10 dark:focus:outline-teal-400';
	const errorInputStyles = 'outline-red-500 dark:outline-red-500';
</script>

<svelte:head>
	<title>Contact - Bart Verkoeijen</title>
	<meta name="description" content="Get in touch with Bart Verkoeijen" />
</svelte:head>

<SimpleLayout
	title="Get in touch"
	intro="Have a question or want to work together? Drop me a message and I'll get back to you as soon as possible."
>
	{#if showSuccess}
		<div
			class="rounded-2xl border border-teal-500/20 bg-teal-50 p-6 dark:border-teal-400/20 dark:bg-teal-400/5"
			role="alert"
		>
			<h2 class="text-sm font-semibold text-teal-900 dark:text-teal-200">Message sent!</h2>
			<p class="mt-2 text-sm text-teal-700 dark:text-teal-300">
				Thank you for your message. I'll get back to you soon.
			</p>
		</div>
	{/if}

	<form
		name="contact"
		method="POST"
		data-netlify="true"
		data-netlify-honeypot="bot-field"
		onsubmit={handleSubmit}
		class="mt-10 space-y-6"
	>
		<!-- Hidden fields required by Netlify -->
		<input type="hidden" name="form-name" value="contact" />
		<input type="hidden" name="bot-field" class="hidden" />

		<!-- Name field -->
		<div>
			<label for="name" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
				Name
			</label>
			<div class="mt-2">
				<input
					type="text"
					id="name"
					name="name"
					bind:value={formData.name}
					onblur={() => handleBlur('name')}
					oninput={() => handleInput('name')}
					required
					autocomplete="name"
					placeholder="Your name"
					title="Please enter your name"
					class="{inputStyles} {touched.name && !formData.name.trim() ? errorInputStyles : ''}"
				/>
			</div>
			{#if touched.name && !formData.name.trim()}
				<p class="mt-2 text-sm text-red-600 dark:text-red-400" id="name-error">
					Please enter your name
				</p>
			{/if}
		</div>

		<!-- Email field -->
		<div>
			<label for="email" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
				Email
			</label>
			<div class="mt-2">
				<input
					type="email"
					id="email"
					name="email"
					bind:value={formData.email}
					onblur={() => handleBlur('email')}
					oninput={() => handleInput('email')}
					required
					autocomplete="email"
					placeholder="your@email.com"
					pattern={emailPattern}
					title="The domain portion of the email address is invalid (the portion after the @)."
					class="{inputStyles} {touched.email && !emailValid ? errorInputStyles : ''}"
				/>
			</div>
			{#if touched.email && !emailValid}
				<p class="mt-2 text-sm text-red-600 dark:text-red-400" id="email-error">
					Please enter a valid email address
				</p>
			{/if}
		</div>

		<!-- Message field -->
		<div>
			<label for="message" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
				Message
			</label>
			<div class="mt-2">
				<textarea
					id="message"
					name="message"
					bind:value={formData.message}
					onblur={() => handleBlur('message')}
					oninput={() => handleInput('message')}
					required
					rows="7"
					placeholder="Write your message here"
					class="{inputStyles} resize-none {touched.message && !formData.message.trim()
						? errorInputStyles
						: ''}"
				></textarea>
			</div>
			{#if touched.message && !formData.message.trim()}
				<p class="mt-2 text-sm text-red-600 dark:text-red-400" id="message-error">
					Please enter a message
				</p>
			{/if}
		</div>

		<!-- Submit button -->
		<div>
			<Button type="submit" disabled={submitting || !formValid} class="w-full">
				{submitting ? 'Sending...' : 'Send Message'}
			</Button>
		</div>
	</form>
</SimpleLayout>
