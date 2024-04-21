<script lang="ts">
	import { Icon, Microphone, StopCircle } from 'svelte-hero-icons';
	import axios from 'axios';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let isRecording = false;
	let mediaRecorder: any = null;
	let chunks: any = [];

	const startRecording = () => {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				mediaRecorder = new MediaRecorder(stream);
				mediaRecorder.start();

				mediaRecorder.addEventListener('dataavailable', (event: any) => {
					chunks.push(event.data);
				});

				mediaRecorder.addEventListener('stop', async () => {
					const audioBlob = new Blob(chunks, { type: 'audio/wav' });
					await transcribeAudioAndChat(audioBlob);
					chunks = [];
				});

				isRecording = true;
			})
			.catch((error) => {
				console.error('Error accessing microphone:', error);
			});
	};

	const stopRecording = async () => {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
			isRecording = false;
		}
	};

	const transcribeAudioAndChat = async (file: any) => {
		try {
			const formData = new FormData();
			formData.append('file', file, 'my-audio.wav');
			const response = await axios.post('/api/transcribe', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			const text = response?.data?.text || null;
			if (text) {
				await askQuestion(text);
			}
		} catch (error) {
			console.error(`Failed to transcribe text, error: ${error}`);
		}
	};

	const askQuestion = async (text: string) => {
		const response = await fetch('/api/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text })
		});
		const data = await response.json();
		console.log('data', data);

		if (data && data != '') {
			await textToSpeech(data);
		}
	};

	// Convert text to speech.
	const textToSpeech = async (text: string) => {
		console.log('text', text);
		const response = await fetch('/api/speech', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text })
		});

		const data = await response.json();
		dispatch('onfinish', data);
	};

	const handleButtonClick = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};
</script>

<div class="flex justify-center">
	<button
		type="button"
		class={`btn btn-sm btn-filled btn-neutral text-white
          ${isRecording ? 'bg-red-500 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
		on:click={handleButtonClick}
	>
		{#if isRecording}
			<Icon src={StopCircle} aria-hidden="true" mini size="20" />
		{:else}
			<Icon src={Microphone} aria-hidden="true" mini size="20" />
		{/if}
	</button>
</div>
