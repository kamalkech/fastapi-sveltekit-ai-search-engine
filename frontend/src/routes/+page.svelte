<script lang="ts">
	import { onMount } from 'svelte';
	import { removeCharacters } from '$lib/helper';
	import type { PageData } from './$types';
	import { t } from '$lib/translations';

	// Import components.
	import IconLight from '$lib/components/icons/icon-light.svelte';
	import IconDark from '$lib/components/icons/icon-dark.svelte';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import FormSigninSignUp from '$lib/components/forms/singin_signup.svelte';
	import Header from '$lib/components/partials/header.svelte';
	import Footer from '$lib/components/partials/footer.svelte';

	export let data: PageData;
	const { user } = data;

	let loading = false;
	let query = '';
	let text = '';
	let content = '';
	$: content = text;
	let audioUrl = '';
	let current_theme: string = 'dark';

	onMount(() => {
		const saved_theme = document.documentElement.getAttribute('data-theme');
		if (saved_theme) {
			current_theme = saved_theme;
			return;
		}
		const preference_is_dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const theme = preference_is_dark ? 'dark' : 'light';
		set_theme(theme);
	});
	// Search.
	const search = async () => {
		try {
			if (query === '') return;
			text = '';
			loading = true;
			await Promise.all([getResponseText()]);
			loading = false;
		} catch (error) {
			console.error(error);
			loading = false;
		}
	};

	// Get answer.
	const getResponseText = async () => {
		const response = await fetch('/api/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text: query
			})
		});

		if (response.body) {
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let done = false;
			while (!done) {
				const { value, done: doneReading } = await reader?.read();
				done = doneReading;
				const chunkValue = decoder.decode(value);
				text += removeCharacters(chunkValue);
			}
		}

		await textToSpeech();
	};

	// Convert text to speech.
	const textToSpeech = async () => {
		loading = true;
		const response = await fetch('/api/speech', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text: content
			})
		});

		const data = await response.json();
		audioUrl = data;
		loading = false;
	};

	// Choose a selected questions.
	const onSelectQuestion = async (event: any) => {
		query = event.detail.question;
		await search();
	};

	// Set theme.
	const set_theme = (theme: string) => {
		const one_year = 60 * 60 * 24 * 365;
		document.cookie = `theme=${theme}; max-age=${one_year}; path=/`;
		document.documentElement.setAttribute('data-theme', theme);
		current_theme = theme;
	};

	// Toggle theme light/dark.
	const toggle_theme = (): void => {
		const theme = current_theme === 'light' ? 'dark' : 'light';
		set_theme(theme);
	};
</script>

<Header {user} on:onSelectQuestion={onSelectQuestion} />

<div
	class="card w-80 h-80 image-full rounded-full border shadow-lg shadow-pink-500/40 border-pink-500/40 dark:shadow-blue-500/20 dark:border-blue-500/20"
>
	<div class="card-body items-center flex justify-center space-y-4">
		<h2 class="card-title">
			{$t(`circle.title`)}
		</h2>

		{#if loading}
			<span class="loading loading-ring loading-lg absolute inset-x-30 -top-10"></span>
		{/if}

		<div class="card-actions flex flex-col">
			<textarea
				disabled={loading}
				class="textarea textarea-bordered border-pink-900 dark:border-sky-900 w-full rounded-md max-h-4 placeholder:italic placeholder:text-slate-400 dark:placeholder:text-gray-500 dark:text-gray-300 text-gray-600"
				placeholder={$t(`circle.placeholder`)}
				value={query}
				on:input={(e) => (query = e.target.value)}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						search();
					}
				}}
			/>
		</div>

		<div class="buttons-actions">
			<button
				class="btn btn-sm btn-filled btn-neutral dark:text-primary text-secondary"
				on:click={toggle_theme}
			>
				{#if current_theme === 'light'}
					<IconDark />
				{:else}
					<IconLight />
				{/if}
			</button>
			<button
				class="btn btn-sm btn-filled btn-neutral dark:text-primary text-secondary"
				on:click={search}
			>
				{#if loading}
					<span class="loading loading-ring w-5 h-5"></span>
				{:else}
					<IconArrowLeft />
				{/if}
			</button>

			{#if user}
				<p class="mt-6 text-xs text-center">{user.firstname} {user.lastname}</p>
			{/if}
		</div>

		{#if loading}
			<span class="loading loading-ring loading-lg absolute inset-x-30 -bottom-5"></span>
		{/if}
	</div>

	{#if audioUrl != ''}
		<audio src={audioUrl} controls autoPlay class="w-full absolute -bottom-20" />
	{/if}

	<!-- footer -->
	<Footer />
</div>

<!-- Form signup and signin -->
<FormSigninSignUp />

<style>
	.card.image-full:before {
		background-color: inherit;
	}
	.image-full {
		background-image: url('/bg.png');
		background-position: center;
		background-size: cover;
		opacity: 0.7;
	}
	.card-actions {
		opacity: 0.85;
	}
	:global(.invalid-feedback.error) {
		font-size: 0.85rem !important;
		margin-top: 0.5rem !important;
		color: red;
	}
</style>
