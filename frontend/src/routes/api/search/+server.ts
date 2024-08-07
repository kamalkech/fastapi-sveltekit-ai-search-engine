import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { ChatService } from '$lib/services/chat.service';

type ChatHistory = {
	input: string;
	output: string;
};

export async function POST({ request, locals, cookies }: any) {
	try {
		const user = locals.user;
		const { text } = await request.json();
		const lng = cookies.get('lng') ?? 'en';

		const chatService = new ChatService();

		// Get last 10 history user.
		let chats: any[] = [];
		const chat_history: ChatHistory[] = [];

		if (user) {
			chats = await chatService.getAllByUser(user.id);
		} else {
			chats = await chatService.getAll();
		}

		if (chats.length > 0) {
			chats.map((chat: { input: string; output: string }) => {
				chat_history.push({
					input: chat.input,
					output: chat.output
				});
			});
		}

		const body = JSON.stringify({
			lng,
			text,
			chat_history
		});

		const response = await fetch(PUBLIC_BACKEND_URL + '/search_stream', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body
		});

		const result = await response.json();

		// Add new history user.
		if (user) {
			await chatService.createByUser({
				input: text,
				output: result,
				userId: user.id
			});
		}

		return new Response(JSON.stringify(result), {
			status: 200
		});
	} catch (error: any) {
		return new Response(`Expect search and get answer:  ${error.message}`, {
			status: 500
		});
	}
}
