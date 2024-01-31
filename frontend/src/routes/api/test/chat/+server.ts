import { ChatService } from '$lib/services/chat.service';

export async function GET({ locals }) {
	try {
		const user = locals.user;
		console.log('user', user);

		const chatService = new ChatService();
		const chats = await chatService.getAllByUser(user.id);
		console.log('chats', chats);

		return new Response(JSON.stringify(chats), {
			status: 200
		});
	} catch (error: any) {
		return new Response(`Expect test connection with database:  ${error.message}`, {
			status: 500
		});
	}
}
