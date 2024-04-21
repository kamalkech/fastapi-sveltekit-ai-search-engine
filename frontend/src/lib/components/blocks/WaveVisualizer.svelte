<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let width = 160;
	export let height = 140;
	let canvas: any;
	let animationFrameId: any;
	const audioData = writable(new Uint8Array());

	onMount(() => {
		const getUserMedia = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				const audioContext = new AudioContext();
				const source = audioContext.createMediaStreamSource(stream);
				const analyser = audioContext.createAnalyser();
				analyser.fftSize = 2048;
				const bufferLength = analyser.frequencyBinCount;
				const dataArray = new Uint8Array(bufferLength);
				source.connect(analyser);

				const updateAudioData = () => {
					analyser.getByteTimeDomainData(dataArray);
					audioData.set(new Uint8Array(dataArray));
					animationFrameId = requestAnimationFrame(updateAudioData);
				};

				updateAudioData();
			} catch (err) {
				console.error('Error getting user media:', err);
			}
		};

		getUserMedia();

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});

	$: if (canvas && $audioData) {
		const drawWave = () => {
			const bufferLength = $audioData.length;
			const step = Math.floor(bufferLength / width);
			const centerY = height * 2;
			const context = canvas.getContext('2d');

			if (!context) return;

			context.clearRect(0, 0, width, height);
			context.beginPath();

			for (let i = 0; i < width; i++) {
				const dataIndex = i * step;
				const amplitude = $audioData[dataIndex] / 210;
				const y = centerY - amplitude * centerY;

				if (i === 0) {
					context.moveTo(i, y);
				} else {
					context.lineTo(i, y);
				}
			}

			context.strokeStyle = '#009FCD';
			context.lineWidth = 1;
			context.stroke();
		};

		drawWave();
	}
</script>

<canvas bind:this={canvas} {width} {height}></canvas>
