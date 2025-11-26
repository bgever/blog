<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

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
</script>

<svelte:head>
	<title>Contact - Bart Verkoeijen's blog</title>
	<meta name="description" content="Get in touch with Bart Verkoeijen" />
</svelte:head>

<main class="max-w-2xl mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-8">Contact</h1>

	{#if showSuccess}
		<div
			class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
			role="alert"
		>
			<p class="font-bold">Success!</p>
			<p>Thank you for your message. I'll get back to you soon.</p>
		</div>
	{/if}

	<form
		name="contact"
		method="POST"
		data-netlify="true"
		data-netlify-honeypot="bot-field"
		onsubmit={handleSubmit}
		class="space-y-6"
	>
		<!-- Hidden fields required by Netlify -->
		<input type="hidden" name="form-name" value="contact" />
		<input type="hidden" name="bot-field" class="hidden" />

		<!-- Name field -->
		<div>
			<label for="name" class="block text-sm font-medium mb-2">Name</label>
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
				class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {touched.name &&
				!formData.name.trim()
					? 'border-red-500'
					: ''}"
			/>
			{#if touched.name && !formData.name.trim()}
				<p class="mt-1 text-sm text-red-600" id="name-error">Please enter your name</p>
			{/if}
		</div>

		<!-- Email field -->
		<div>
			<label for="email" class="block text-sm font-medium mb-2">Email</label>
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
				class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {touched.email &&
				!emailValid
					? 'border-red-500'
					: ''}"
			/>
			{#if touched.email && !emailValid}
				<p class="mt-1 text-sm text-red-600" id="email-error">
					Please enter a valid email address
				</p>
			{/if}
		</div>

		<!-- Message field -->
		<div>
			<label for="message" class="block text-sm font-medium mb-2">Message</label>
			<textarea
				id="message"
				name="message"
				bind:value={formData.message}
				onblur={() => handleBlur('message')}
				oninput={() => handleInput('message')}
				required
				rows="7"
				placeholder="Write your message here"
				class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {touched.message &&
				!formData.message.trim()
					? 'border-red-500'
					: ''}"
			></textarea>
			{#if touched.message && !formData.message.trim()}
				<p class="mt-1 text-sm text-red-600" id="message-error">Please enter a message</p>
			{/if}
		</div>

		<!-- Submit button -->
		<button
			type="submit"
			disabled={submitting || !formValid}
			class="w-full bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
		>
			{submitting ? 'Sending...' : 'Send Message'}
		</button>
	</form>
</main>
