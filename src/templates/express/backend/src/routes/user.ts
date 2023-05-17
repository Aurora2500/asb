import { z } from "zod";

import { router, publicProcedure } from "../trpc.js";

export const userRouter = router({
	all: publicProcedure
		.query(async ({ ctx: { prisma } }) => {
			const users = await prisma.user.findMany();
			return users;
		}),
	byId: publicProcedure
		.input(z.object({
			id: z.number(),
		}))
		.query(async ({ input: { id }, ctx: { prisma } }) => {
			const user = await prisma.user.findUnique({
				where: {
					id,
				},
			});
			return user;
		}),
});