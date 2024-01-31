import { BACKEND_URL } from '$env/static/private';
import { ChatService } from '$lib/services/chat.service';

type ChatHistory = {
	input: string;
	output: string;
};

export async function POST({ request, locals, cookies }) {
	try {
		const user = locals.user;
		const { text } = await request.json();
		const lng = cookies.get('lng') ?? 'en';

		const chatService = new ChatService();

		// Get last 10 history user.
		const chat_history: ChatHistory[] = [];
		if (user) {
			const chats = await chatService.getAllByUser(user.id);
			if (chats.length > 0) {
				chats.map((chat) => {
					chat_history.push({
						input: chat.input,
						output: chat.output
					});
				});
			}
		}

		const response = await fetch(BACKEND_URL + '/search_stream', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				lng,
				text,
				chat_history
			})
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
