import type { ChatCreateDto } from '$lib/dto/chat.dto';
import prisma from '$lib/prisma';

export default class ChatService {
	async createByUser(input: ChatCreateDto): Promise<void> {
		const result = await prisma.chat.create({
			data: {
				input: input.input,
				output: input.output,
				userId: 1
			}
		});
		console.log('result', result);
	}
}
