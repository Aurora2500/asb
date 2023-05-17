import { PrismaClient } from "@prisma/client";

export type AppState = {

}

export type AppContext = {
	state: AppState;
	prisma: PrismaClient;
}

export const createContext = (state: AppState, prisma: PrismaClient) => (): AppContext => {
	return {
		state,
		prisma
	};
};
