import { BACKEND_URL } from '$env/static/private';
import ChatService from '$lib/services/chat.service';

export async function POST({ request }) {
	try {
		const { text } = await request.json();

		// Get last 10 history.

		const response = await fetch(BACKEND_URL + '/search_stream', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text
			})
		});

		const result = await response.json();

		// Add new history.
		const chatService = new ChatService();
		await chatService.createByUser({
			input: text,
			output: result,
			userId: 1000
		});

		return new Response(JSON.stringify(result), {
			status: 200
		});
	} catch (error: any) {
		return new Response(`Expect search and get answer:  ${error.message}`, {
			status: 500
		});
	}
}
