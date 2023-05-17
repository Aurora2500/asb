import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { PrismaClient } from "@prisma/client";

import { router, publicProcedure } from "./trpc.js";
import { AppState, createContext } from "./context.js";
import { userRouter } from "./routes/user.js";
import { observable } from "@trpc/server/observable";

const app = express();
app.use(cors());

const prisma = new PrismaClient();

const appRouter = router({
	hello: publicProcedure.query(() => "world"),
	clock: publicProcedure.subscription(() => {
		return observable<string>(emit => {
			const intervalId = setInterval(() => {
				emit.next(new Date().toISOString());
			}, 1000);
			return () => {
				clearInterval(intervalId);
			};
		});
	}),
	user: userRouter,
});

export type AppRouter = typeof appRouter;

const state: AppState = {

};

app.use("/trpc", createExpressMiddleware({
	router: appRouter,
	createContext: createContext(state, prisma),
}));

const server = app.listen(4000, () => {
	console.log("listening on port 4000");
});

applyWSSHandler({
	wss: new WebSocketServer({ server }),
	router: appRouter,
	createContext: createContext(state, prisma),
});