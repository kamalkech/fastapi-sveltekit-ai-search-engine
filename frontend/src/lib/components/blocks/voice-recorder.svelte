<script lang="ts">
	import { Icon, Microphone, StopCircle } from 'svelte-hero-icons';
	import axios from 'axios';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let isRecording = false;
	let mediaRecorder: any = null;
	let chunks: any = [];
	let loading = false;
	let audioUrl = '';

	const BACKEND_URL = 'http://localhost:8000';

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
			loading = true;
			dispatch('onloading', true);

			const formData = new FormData();
			formData.append('file', file, 'my-audio.wav');
			const response = await axios.post(BACKEND_URL + '/search_stream', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				responseType: 'blob'
			});

			if (response) {
				audioUrl = URL.createObjectURL(response.data);
				// new Audio(audioUrl).play();

				// Dispatch.
				dispatch('onfinish', audioUrl);
				// dispatch('ontranscribe', text);
				// await askQuestion(text);
			}
			loading = false;
			dispatch('onloading', false);
		} catch (error) {
			loading = false;
			dispatch('onloading', false);
			console.error(`Failed to transcribe text, error: ${error}`);
		}
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
          ${isRecording ? 'bg-red-500 hover:bg-red-500' : 'bg-secondary hover:bg-fuchsia-500'}`}
		on:click={handleButtonClick}
	>
		{#if loading}
			<span class="loading loading-ring w-5 h-5"></span>
		{:else if isRecording}
			<Icon src={StopCircle} aria-hidden="true" mini size="20" />
		{:else}
			<Icon src={Microphone} aria-hidden="true" mini size="20" />
		{/if}
		<!-- <audio src={audioUrl} controls autoPlay class="w-full" /> -->
	</button>
</div>
