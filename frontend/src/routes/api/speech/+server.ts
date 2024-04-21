import { TextToSpeechClient } from '@google-cloud/text-to-speech';

export async function POST({ request, cookies }: any) {
	try {
		const client = new TextToSpeechClient();
		const { text } = await request.json();
		const lng = cookies.get('lng') ?? 'en';

		let languageCode = 'en-US';
		let name = 'en-US-Neural2-G';
		if (lng === 'ar') {
			languageCode = 'ar-XA';
			name = 'ar-XA-Standard-D';
		}

		// Construct the request
		const data = {
			input: { text: text },
			// Select the language and SSML voice gender (optional)
			voice: {
				// ssmlGender: 'NEUTRAL',
				languageCode,
				name
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
		const response: any = await client.synthesizeSpeech(data);
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

// import { OPENAI_API_KEY } from '$env/static/private';
// import OpenAI from 'openai';
//
// const openai = new OpenAI({
// 	apiKey: OPENAI_API_KEY
// });
//
// export async function POST({ request }: any) {
// 	try {
// 		const { text } = await request.json();
// 		console.log('text', text);
//
// 		const mp3 = await openai.audio.speech.create({
// 			model: 'tts-1',
// 			voice: 'onyx', // "alloy",
// 			input: text
// 		});
// 		const buffer = Buffer.from(await mp3.arrayBuffer());
// 		const base64String = buffer.toString('base64');
// 		const dataUrl = `data:audio/mp3;base64,${base64String}`;
// 		console.log('dataUrl', dataUrl);
//
// 		return Response.json(
// 			{ dataUrl },
// 			{
// 				status: 200
// 			}
// 		);
// 	} catch (error: any) {
// 		return Response.json(error.message, {
// 			status: 500
// 		});
// 	}
// }
