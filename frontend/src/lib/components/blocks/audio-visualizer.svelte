<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import axios from 'axios';

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
	});

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	});

	const setupCanvas = () => {
		const ctx = canvas?.getContext('2d');
		if (ctx && canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			drawStaticVisualizer(ctx, canvas.width, canvas.height);
		}
	};

	const drawStaticVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, width, height);

		const centerX = width / 2;
		const centerY = height / 2;
		const radius = 150;

		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.font = '20px Arial';
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'center';
		ctx.fillText('Audio Visualizer', centerX, centerY);
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
		} catch (err) {
			console.error('Error accessing microphone:', err);
		}
	};

	const drawVisualizer = () => {
		const ctx = canvas?.getContext('2d');
		if (!ctx || !canvas) return;

		animationId = requestAnimationFrame(drawVisualizer);

		analyser.getByteFrequencyData(dataArray);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

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
			mediaRecorder.stop();
			isRecording.set(false);
		}
	};

	const sendAudioToBackend = async (audioBlob: Blob) => {
		const formData = new FormData();
		formData.append('lng', 'en');
		formData.append('file', audioBlob, 'recording.wav');

		try {
			const BACKEND_URL = 'http://localhost:8000';
			const response = await axios.post(BACKEND_URL + '/search_stream', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				responseType: 'blob'
			});

			if (response) {
				const audioUrl = URL.createObjectURL(response.data);
				console.log('Audio URL:', audioUrl);
				audioElement = new Audio(audioUrl);
				playAudioWithVisualizer();
			}
			console.log('Backend response:', response.data);
		} catch (error) {
			console.error('Error sending audio to backend:', error);
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

	const playAudio = () => {
		const url = 'blob:http://localhost:5555/579d33cc-a05c-47f8-b6c5-b5c1d2a823dc';
		// const audio = new Audio(url);
		// audio.play();

		audioElement = new Audio(url);
		playAudioWithVisualizer();

		// // audioElement.play();
		// audioElement.addEventListener('canplaythrough', async () => {
		// 	setupAudioContext();
		// 	drawVisualizer();
		// });
	};
</script>

<canvas bind:this={canvas} width="600" height="600"></canvas>
<button on:click={playAudio}>Play Audio</button>
<div>
	{#if $isRecording}
		<button on:click={stopRecording}>Stop Recording</button>
	{:else}
		<button on:click={startRecording}>Start Recording</button>
	{/if}
</div>
{#if $audioURL}
	<audio bind:this={audioElement} src={$audioURL} controls on:play={playAudioWithVisualizer}
	></audio>
{/if}

<style>
	canvas {
		display: block;
		margin: 20px auto;
		background: black;
	}
	div {
		text-align: center;
	}
	button {
		margin: 10px;
	}
</style>
