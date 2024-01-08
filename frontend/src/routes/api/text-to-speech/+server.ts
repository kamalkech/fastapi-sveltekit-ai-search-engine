import OpenAI from 'openai';

const textToSpeech = async (text: string, openai_key: string): Promise<string> => {
	try {
		const openai = new OpenAI({
			apiKey: openai_key
		});

		const response = await openai.audio.speech.create({
			model: 'tts-1',
			// voice: 'fable',
			voice: 'onyx', // good
			// voice: 'shimmer',
			// voice: 'echo', // good
			// voice: 'alloy', // good but number arabic very bad
			// voice: 'nova',
			input: text,
			// response_format: 'mp3',
			response_format: 'opus'
		});
		const buffer = Buffer.from(await response.arrayBuffer());
		const base64String = buffer.toString('base64');
		const dataUrl = `data:audio/mp3;base64,${base64String}`;
		return dataUrl;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
	try {
		const openai_key = cookies.get('openai_key');

		if (!openai_key || openai_key === '') {
			return new Response('Missing OpenAI key', { status: 400 });
		}

		const { text } = await request.json();
		const audioUrl = await textToSpeech(text, openai_key);

		return new Response(JSON.stringify(audioUrl), {
			status: 200
		});
	} catch (error) {
		console.error('An error occurred:', error);
		throw error;
	}
}
