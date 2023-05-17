import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	await prisma.user.create({
		data: {
			email: 'john.smith@example.com',
			name: 'John Smith',
			posts: {
				create: {
					title: 'Hello World',
					content: 'This is my first post',
				},
			},
		}
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	})