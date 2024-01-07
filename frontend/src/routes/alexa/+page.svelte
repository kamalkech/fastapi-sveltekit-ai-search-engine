<script lang="ts">
  import { browser } from '$app/environment';
	// import SvelteMarkdown from 'svelte-markdown';
	import IconSettings from '$lib/components/icons/icon-settings.svelte';

  let loading = false;
  let query = '';
  let text = '';
  let content = '';
  $: content = text;
	let audioUrl = '';
	let keyValue: string = browser ? (window.localStorage.getItem('openai_key') as string) : '';

  const removeCharacters = (sentence: string): string => {
		const charactersToRemove = '"\'}.`,``';
		return sentence
			.split('')
			.filter((char) => !charactersToRemove.includes(char))
			.join('');
	};

	const getText = async () => {
		const response = await fetch('/api/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text: query,
				openai_key: keyValue
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
		const key = localStorage.getItem('openai_key') || '';
		if (!key || key === '') {
			alert('Please enter a valid openai key');
			return;
		}

		text = '';
		loading = true;
		await Promise.all([getText()]);
		loading = false;
	};

  const textToSpeech = async () => {
		loading = true;
		const response = await fetch('/api/text-to-speech', {
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

	const saveKey = async () => {
		loading = true;
		const response = await fetch('/api/cookies', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				key: keyValue
			})
		});

		if (response.ok) {
			localStorage.setItem('openai_key', keyValue);
		}
		setTimeout(() => {}, 5000);
		loading = false;
	};
</script>

<div class="flex min-h-screen flex-col items-center justify-center p-24">

  <div class="card w-96 h-96 image-full rounded-full shadow-inner shadow-blue-500/10 border border-blue-500/20">
    <!-- <img src="/bg2.webp" alt="bg" class="opacity-40"/> -->
    <div class="card-body items-center flex justify-center">
      <h2 class="card-titl">محرك البحث</h2>
      <!-- <div><SvelteMarkdown source={content} /></div> -->
      <div class="card-actions justify-end">
        <div class="col-span-11 rounded-full bg-gray-800">
					<input
						disabled={loading}
						type="text"
						class="textarea textarea-bordered border-sky-900 w-full rounded-full max-h-4 placeholder:italic placeholder:text-slate-400"
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
					class="btn btn-sm btn-filled btn-neutral mt-3"
					on:click={() => document.getElementById('llm_settings').showModal()}
				>
					<IconSettings />
				</button>
      </div>
    </div>

    {#if loading}
      <span class="loading loading-ring loading-lg absolute inset-x-40 bottom-0"></span>
    {/if}

    {#if audioUrl != ''}
      <audio src={audioUrl} controls autoPlay class="w-full hidden" />
    {/if}
  </div>

</div>

<dialog id="llm_settings" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="font-bold text-lg text-center mt-4">OpenAI Settings</h3>
		<label class="py-4 form-control w-full">
			<input
				type="text"
				placeholder="المفتاح"
				class="input input-bordered w-full"
				value={keyValue}
				on:input={(e) => (keyValue = e.target.value)}
			/>
			<div class="text-center">
				<button
					disabled={loading}
					class="btn btn-sm btn-filled btn-neutral mt-3"
					on:click={saveKey}
				>
					حفظ
				</button>
			</div>
		</label>
	</div>
</dialog>

<style>
  .card.image-full:before {
    background-color: inherit
  }
  .image-full {
    background-image: url('./bg3.png');
    background-position: center;
    background-size: cover;
    opacity: 0.7;
  }
  .card-actions {
    opacity: 0.85;
  }
</style>