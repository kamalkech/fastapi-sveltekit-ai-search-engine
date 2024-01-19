import { PrismaClient } from '@prisma/client';
import userData from '../src/lib/data.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	for (const p of userData) {
		const user = await prisma.user.create({
			data: {
				firstname: p.author.firstname,
				lastname: p.author.lastname,
				password: p.author.password,
				email: p.author.email,
				status: 1,
				code: '123456',
				language: 'en'
				// posts: {
				// 	create: {
				// 		title: p.title,
				// 		content: p.content,
				// 		published: p.published
				// 	}
				// }
			}
		});
		console.log(`Created user with id: ${user.id}`);
	}
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
