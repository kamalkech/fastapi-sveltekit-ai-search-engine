import { TextToSpeechClient } from '@google-cloud/text-to-speech';

export async function POST({ request }) {
	try {
		const client = new TextToSpeechClient();
		const { text } = await request.json();

		// Construct the request
		const data = {
			input: { text: text },
			// Select the language and SSML voice gender (optional)
			voice: {
				languageCode: 'ar-XA',
				// ssmlGender: 'NEUTRAL',
				name: 'ar-XA-Standard-D'
			},
			// select the type of audio encoding
			audioConfig: {
				// audioEncoding: 'MP3',
				audioEncoding: 'LINEAR16',
				// effectsProfileId: ['large-home-entertainment-class-device'],
				pitch: -1.2, // 0
				speakingRate: 0.96 // 1
			}
		};

		// Performs the text-to-speech request
		const response = await client.synthesizeSpeech(data);
		const buffer = Buffer.from(await response[0]?.audioContent);
		const base64String = buffer.toString('base64');
		const dataUrl = `data:audio/mp3;base64,${base64String}`;

		return new Response(JSON.stringify(dataUrl), {
			status: 200
		});
	} catch (error) {
		console.error('An error occurred:', error);
		return new Response(JSON.stringify(error.message), {
			status: 500
		});
	}
}
