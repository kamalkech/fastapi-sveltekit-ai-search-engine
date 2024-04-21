import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export async function POST({ request }: any) {
	try {
		const data = await request.formData();
		const file: File | null = data.get('file') as unknown as File;

		const transcription = await openai.audio.transcriptions.create({
			file: file,
			model: 'whisper-1',
			response_format: 'text'
		});

		return Response.json(
			{ text: transcription },
			{
				status: 200
			}
		);
	} catch (error: any) {
		return new Response(`Expect test connection with database:  ${error.message}`, {
			status: 500
		});
	}
}
