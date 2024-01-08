<script lang="ts">
	// import IconSettings from '$lib/components/icons/icon-settings.svelte';
	import IconLight from '$lib/components/icons/icon-light.svelte';
	import IconDark from '$lib/components/icons/icon-dark.svelte';
	import { removeCharacters } from '$lib/helper';
	import { questions } from '$lib/questions';
	import { onMount } from 'svelte';

	let loading = false;
	let query = '';
	let text = '';
	let content = '';
	$: content = text;
	let audioUrl = '';
	let current_theme: string = 'dark';
	const currentYear = new Date().getFullYear();

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

	const getText = async () => {
		const response = await fetch('/api/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text: query,
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

	const sendQuestion = async () => {
		try {
			text = '';
			loading = true;
			await Promise.all([getText()]);
			loading = false;
		} catch (error) {
			console.error(error);
			loading = false;
		}
	};

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

	const onSelectQuestion = async (question: string) => {
		document.body.click()

		query = question;
		await sendQuestion();
	};

	const set_theme = (theme: string) => {
		const one_year = 60 * 60 * 24 * 365;
		document.cookie = `theme=${theme}; max-age=${one_year}; path=/`;
		document.documentElement.setAttribute('data-theme', theme);
		current_theme = theme;
	};

	const toggle_theme = (): void => {
		const theme = current_theme === 'light' ? 'dark' : 'light';
		set_theme(theme);
	};
</script>

<div class="dropdown dropdown-bottom dropdown-end dropdown-hover w-96 rounded-box mb-8 text-sm flex justify-center">
  <div tabindex="-1"	role="button" id="show-questions" class=" btn m-1 border-0 text-white bg-pink-500 shadow-lg shadow-indigo-500/50 hover:bg-pink-800 dark:bg-slate-800 dark:hover:bg-slate-700">أسئلة مختارة</div>
  <ul tabindex="-1" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full">
		{#each questions as question}
			<li>
				<button on:click={async () => await onSelectQuestion(question)}>{question}</button>
			</li>
		{/each}
	</ul>
</div>

<div
	class="card w-96 h-96 image-full rounded-full shadow-inner shadow-blue-500/10 border border-blue-500/20"
>
	<div class="card-body items-center flex justify-center">
		<h2 class="card-title">أكتب سؤالك</h2>

		{#if loading}
			<span class="loading loading-ring loading-lg absolute inset-x-40 top-0"></span>
		{/if}

		<!-- <div><SvelteMarkdown source={content} /></div> -->
		<div class="card-actions justify-end">
			<div class="col-span-11 rounded-full bg-gray-800">
				<input
					disabled={loading}
					type="text"
					class="textarea textarea-bordered border-sky-900 w-full rounded-full max-h-4 placeholder:italic placeholder:text-slate-400 dark:placeholder:text-gray-500 dark:text-gray-300 text-gray-600"
					placeholder=" اطرح أي سؤال"
					value={query}
					on:input={(e) => (query = e.target.value)}
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							sendQuestion();
						}
					}}
				/>
			</div>

			<button
				class="btn btn-sm btn-filled btn-neutral dark:text-primary text-secondary mt-2"
				on:click={toggle_theme}
			>
				{#if current_theme === 'light'}
					<IconDark />
				{:else}
					<IconLight />
				{/if}
			</button>
		</div>
	</div>

	{#if loading}
		<span class="loading loading-ring loading-lg absolute inset-x-40 bottom-0"></span>
	{/if}

	{#if audioUrl != ''}
		<audio src={audioUrl} controls autoPlay class="w-full absolute -bottom-20" />
	{/if}

	<footer class="footer footer-center p-4 text-base-content absolute -bottom-40">
		<aside>
			<p>حقوق النشر © {currentYear} - جميع الحقوق محفوظة، تم إنشاءها بواسطة  المهندس<span class="badge badge-sm badge-warning font-bold">كمال سحمود</span></p>
		</aside>
	</footer>
</div>

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
</style>
