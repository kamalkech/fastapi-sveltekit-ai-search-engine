import type { ChatCreateDto } from '$lib/dto/chat.dto';
import prisma from '$lib/prisma';

export default class ChatService {
	async createByUser(input: ChatCreateDto): Promise<void> {
		const result = await prisma.chat.create({
			data: {
				input: input.input,
				output: input.output,
				userId: input.userId
			}
		});
		console.log('result', result);
	}

	async getAllByUser(userId: number, limit: number = 10): Promise<any> {
		return await prisma.chat.findMany({
			skip: 0,
			take: limit,
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			}
		});
	}
}
