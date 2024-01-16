<script lang="ts">
	import IconLight from '$lib/components/icons/icon-light.svelte';
	import IconDark from '$lib/components/icons/icon-dark.svelte';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import { removeCharacters } from '$lib/helper';
	import { questions } from '$lib/questions';
	import { onMount } from 'svelte';

	import SignupForm from '$lib/components/forms/signup.svelte';
	import SigninForm from '$lib/components/forms/signin.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	const { user } = data;
	console.log('user', user);

	let showDropdown = false;
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

	const sendQuestion = async () => {
		try {
			if (query === '') return;
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
		showDropdown = false;
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

<ul class="menu bg-base-200 lg:menu-horizontal rounded-box mb-4">
	<li>
		<div class="dropdown dropdown-bottom rounded-box text-sm flex justify-center">
			<div
				tabindex="-1"
				id="show-questions"
				role="button"
				class="text-black dark:text-white"
				on:focus={() => {
					showDropdown = true;
				}}
			>
				<span class="badge badge-xs badge-warning"></span>
				أسئلة مختارة
			</div>
			{#if showDropdown}
				<ul
					tabindex="-1"
					class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-96"
				>
					{#each questions as question}
						<li>
							<button on:click={async () => await onSelectQuestion(question)}>{question}</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</li>
	<li>
		<div class="dropdown dropdown-bottom dropdown-hover rounded-box text-sm flex justify-center">
			{#if user}
				<form method="POST" action="?/logout">
					<button type="submit" class="text-red-400 btn-error" name="logout" value="true">
						<span class="badge badge-xs badge-error"></span>
						خروج
					</button>
				</form>
			{:else}
				<button
					class="text-black dark:text-white"
					on:click={() => document.getElementById('form_signup').showModal()}
				>
					<span class="badge badge-xs badge-primary"></span>
					الحساب
				</button>
			{/if}
		</div>
	</li>
	<li>
		<div class="dropdown dropdown-bottom rounded-box text-sm flex justify-center">
			<div tabindex="-3" role="button" id="show-questions" class="text-black dark:text-white">
				<span class="badge badge-xs badge-secondary"></span>
				اختر اللغة
			</div>
			<ul tabindex="-3" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
				<li>
					<button>العربية</button>
				</li>
				<li>
					<button>الانجليزية</button>
				</li>
			</ul>
		</div>
	</li>
</ul>

<div
	class="card w-80 h-80 image-full rounded-full border shadow-lg shadow-pink-500/40 border-pink-500/40 dark:shadow-blue-500/20 dark:border-blue-500/20"
>
	<div class="card-body items-center flex justify-center space-y-4">
		<h2 class="card-title">أكتب سؤالك</h2>

		{#if loading}
			<span class="loading loading-ring loading-lg absolute inset-x-30 -top-10"></span>
		{/if}

		<div class="card-actions flex flex-col">
			<textarea
				disabled={loading}
				class="textarea textarea-bordered border-pink-900 dark:border-sky-900 w-full rounded-md max-h-4 placeholder:italic placeholder:text-slate-400 dark:placeholder:text-gray-500 dark:text-gray-300 text-gray-600"
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
				on:click={sendQuestion}
			>
				{#if loading}
					<span class="loading loading-ring w-5 h-5"></span>
				{:else}
					<IconArrowLeft />
				{/if}
			</button>

			{#if user}
				<p class="mt-6 text-xs">{user.firstname} {user.lastname}</p>
			{/if}
		</div>

		{#if loading}
			<span class="loading loading-ring loading-lg absolute inset-x-30 -bottom-5"></span>
		{/if}
	</div>

	{#if audioUrl != ''}
		<audio src={audioUrl} controls autoPlay class="w-full absolute -bottom-20" />
	{/if}

	<footer class="footer footer-center p-4 text-base-content absolute -bottom-40">
		<aside>
			<p>
				حقوق النشر © {currentYear} - جميع الحقوق محفوظة، تم إنشاءها بواسطة المهندس
				<span class="badge badge-sm badge-secondary dark:badge-primary font-bold">كمال سحمود</span>
			</p>
		</aside>
	</footer>
</div>

<dialog id="form_signup" class="modal">
	<div class="modal-box">
		<div role="tablist" class="tabs tabs-bordered">
			<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="الدخول" />
			<div role="tabpanel" class="tab-content mt-6">
				<SigninForm />
			</div>

			<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="التسجيل" checked />
			<div role="tabpanel" class="tab-content mt-6">
				<SignupForm />
			</div>
		</div>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-warning">أغلق</button>
			</form>
		</div>
	</div>
</dialog>

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
