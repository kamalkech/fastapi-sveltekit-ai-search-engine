<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { t, locale } from '$lib/translations';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import axios from 'axios';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	// Import components.
	import IconLight from '$lib/components/icons/icon-light.svelte';
	import IconDark from '$lib/components/icons/icon-dark.svelte';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import Header from '$lib/components/partials/header.svelte';
	import Footer from '$lib/components/partials/footer.svelte';
	import { writable } from 'svelte/store';
	import { Icon, Microphone, SpeakerWave, StopCircle } from 'svelte-hero-icons';

	export let data: PageData;
	const { user }: any = data;

	let loading = false;
	let text = '';
	let query = '';
	let content = '';
	$: content = text;
	let audioUrl = '';
	let current_theme: string = 'dark';

	let isRecording = writable(false);
	let audioURL = writable<string | null>(null);
	let mediaRecorder: MediaRecorder | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let audioContext: AudioContext;
	let analyser: AnalyserNode;
	let dataArray: Uint8Array;
	let bufferLength: number;
	let audioSource: MediaStreamAudioSourceNode | null = null;
	let audioElement: HTMLAudioElement | null = null;
	let animationId: number;

	onMount(() => {
		setupCanvas();

		const saved_theme = document.documentElement.getAttribute('data-theme');
		if (saved_theme) {
			current_theme = saved_theme;
			return;
		}
		const preference_is_dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const theme = preference_is_dark ? 'dark' : 'light';
		set_theme(theme);
	});

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	});

	// Search.
	const search = async () => {
		try {
			if (query === '') return;
			text = '';
			loading = true;
			// await Promise.all([getResponseText()]);
			loading = false;
		} catch (error) {
			console.error(error);
			loading = false;
		}
	};

	const setupCanvas = () => {
		const ctx = canvas?.getContext('2d');
		if (ctx && canvas) {
			canvas.width = window.innerWidth / 1.3;
			canvas.height = window.innerHeight / 1.3;
			drawStaticVisualizer(ctx, canvas.width, canvas.height);
		}
	};

	const drawStaticVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
		const centerX = width / 2;
		const centerY = height / 2;
		const radius = 150;

		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
	};

	const setupAudioContext = () => {
		const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
		audioContext = new AudioContext();
		analyser = audioContext.createAnalyser();
		analyser.fftSize = 256;
		bufferLength = analyser.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);
	};

	const startVisualizer = async () => {
		setupAudioContext();
		await startMicrophone();
		drawVisualizer();
	};

	const startMicrophone = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioSource = audioContext.createMediaStreamSource(stream);
			audioSource.connect(analyser);
		} catch (err: any) {
			console.error('Error accessing microphone:', err);
			throw new Error('Error accessing microphone:', err.message);
		}
	};

	const drawVisualizer = () => {
		const ctx = canvas?.getContext('2d');
		if (!ctx || !canvas) return;

		animationId = requestAnimationFrame(drawVisualizer);
		analyser.getByteFrequencyData(dataArray);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const radius = 150;
		const bars = bufferLength;
		const barWidth = 2;

		for (let i = 0; i < bars; i++) {
			const rads = (Math.PI * 2) / bars;
			const barLength = dataArray[i] * 0.5;

			const x = centerX + Math.cos(rads * i) * (radius + barLength);
			const y = centerY + Math.sin(rads * i) * (radius + barLength);

			const xEnd = centerX + Math.cos(rads * i) * radius;
			const yEnd = centerY + Math.sin(rads * i) * radius;

			const gradient = ctx.createLinearGradient(xEnd, yEnd, x, y);
			gradient.addColorStop(0, `rgba(255, 0, 255, 1)`);
			gradient.addColorStop(1, `rgba(0, 255, 255, 1)`);

			ctx.strokeStyle = gradient;
			ctx.lineWidth = barWidth;
			ctx.beginPath();
			ctx.moveTo(xEnd, yEnd);
			ctx.lineTo(x, y);
			ctx.stroke();
		}
	};

	const startRecording = async () => {
		await startVisualizer();
		mediaRecorder = new MediaRecorder(await navigator.mediaDevices.getUserMedia({ audio: true }));
		const audioChunks: Blob[] = [];

		mediaRecorder.ondataavailable = (event) => {
			audioChunks.push(event.data);
		};

		mediaRecorder.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
			sendAudioToBackend(audioBlob);
			audioURL.set(URL.createObjectURL(audioBlob));
		};

		mediaRecorder.start();
		isRecording.set(true);
	};

	const stopRecording = () => {
		if (mediaRecorder) {
			console.log('stop recording');
			mediaRecorder.stop();
			isRecording.set(false);
		}
	};

	const sendAudioToBackend = async (audioBlob: Blob) => {
		loading = true;

		const formData = new FormData();
		formData.append('lng', $locale);
		formData.append('file', audioBlob, 'recording.wav');

		try {
			const response = await axios.post(PUBLIC_BACKEND_URL + '/search_stream', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				responseType: 'blob'
			});

			if (response) {
				audioUrl = URL.createObjectURL(response.data);
				audioElement = new Audio(audioUrl);
				// playAudioWithVisualizer();
			}

			loading = false;
		} catch (error: any) {
			loading = false;

			console.error('Error sending audio to backend:', error);
			throw new Error('Error sending audio to backend:', error.message);
		}
	};

	const playAudioWithVisualizer = () => {
		if (!audioElement) return;

		setupAudioContext();
		const source = audioContext.createMediaElementSource(audioElement);
		source.connect(analyser);
		analyser.connect(audioContext.destination);

		audioElement.play();
		drawVisualizer();
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

	// Update theme.
	const submitUpdateTheme: SubmitFunction = ({ action }: any) => {
		const theme = action.searchParams.get('theme');
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
			current_theme = theme;
		}
	};
</script>

<Header {user} on:onSelectQuestion={onSelectQuestion} />

<div class="mt-4 w-full flex justify-center items-center relative">
	<canvas bind:this={canvas} class="w-full h-auto fixed"> </canvas>
	<div
		class="w-96 h-96 relative image-full rounded-full border shadow-lg shadow-pink-500/40 border-pink-500/40 dark:shadow-blue-500/20 dark:border-blue-500/20 space-y-6 z-40 fixed"
	>
		<div class="card-body items-center flex justify-center space-y-12 mt-16">
			<h2 class="card-title text-white">
				{$t(`circle.title`)}
			</h2>

			<!-- <div class="card-actions flex flex-col w-full"> -->
			<!-- 	<textarea -->
			<!-- 		class="textarea w-full rounded-md max-h-4 placeholder:italic placeholder:text-slate-400 dark:placeholder:text-gray-500 dark:text-gray-300 text-gray-600" -->
			<!-- 		placeholder={$t(`circle.placeholder`)} -->
			<!-- 	/> -->
			<!-- </div> -->

			<div class="buttons-actions flex flex-row justify-center gap-2">
				<form method="POST" use:enhance={submitUpdateTheme}>
					{#if current_theme === 'light'}
						<button
							class="btn rounded-full btn-filled btn-neutral dark:text-primary text-secondary"
							formaction="/?/setTheme&theme=dark&redirectTo={$page.url.pathname}"
						>
							<IconDark />
						</button>
					{:else}
						<button
							class="btn rounded-full btn-filled btn-neutral dark:text-primary text-secondary"
							formaction="/?/setTheme&theme=light&redirectTo={$page.url.pathname}"
						>
							<IconLight />
						</button>
					{/if}
				</form>

				<div class="z-50">
					{#if $isRecording}
						<button
							class={`btn rounded-full btn-filled btn-neutral text-white bg-secondary hover:bg-fuchsia-500`}
							on:click={stopRecording}
						>
							<Icon src={StopCircle} aria-hidden="true" mini size="20" />
						</button>
					{:else}
						<button
							class={`btn rounded-full btn-filled btn-neutral text-white bg-secondary hover:bg-fuchsia-500`}
							on:click={startRecording}
						>
							{#if loading}
								<span class="loading loading-ring w-5 h-5"></span>
							{:else}
								<Icon src={Microphone} aria-hidden="true" mini size="20" />
							{/if}
						</button>
					{/if}
				</div>

				<!-- <button -->
				<!-- 	class="btn btn-sm btn-filled btn-neutral dark:text-primary text-secondary" -->
				<!-- 	on:click={search} -->
				<!-- > -->
				<!-- 	{#if loading} -->
				<!-- 		<span class="loading loading-ring w-5 h-5"></span> -->
				<!-- 	{:else} -->
				<!-- 		<IconArrowLeft /> -->
				<!-- 	{/if} -->
				<!-- </button> -->

				<!-- {#if audioUrl != ''} -->
				<!-- 	<button -->
				<!-- 		class="btn btn-sm btn-filled btn-neutral dark:text-primary text-secondary" -->
				<!-- 		on:click={() => { -->
				<!-- 			audioElement = new Audio(audioUrl); -->
				<!-- 			playAudioWithVisualizer(); -->
				<!-- 		}} -->
				<!-- 	> -->
				<!-- 		<Icon src={SpeakerWave} aria-hidden="true" mini size="20" /> -->
				<!-- 	</button> -->
				<!-- {/if} -->
			</div>
		</div>

		<!-- footer -->
		{#if audioUrl}
			<div class="footer footer-center absolute -bottom-20 text-base-content">
				<audio src={audioUrl} bind:this={audioElement} autoPlay controls class="w-full" />
			</div>
		{/if}
		<Footer />
	</div>
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
	:global(.invalid-feedback.error) {
		font-size: 0.85rem !important;
		margin-top: 0.5rem !important;
		color: red;
	}
</style>
