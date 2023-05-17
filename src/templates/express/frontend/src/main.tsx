import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, wsLink, splitLink, createWSClient} from "@trpc/client";

import { theme } from "theme.ts";
import App from "./App.tsx";
import { trpc } from "trpc.ts";

const wsClient = createWSClient({
	url: "ws://localhost:4000/trpc",
});

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
	links: [
		splitLink({
			condition: (op) => op.type === "subscription",
			true: wsLink({
				client: wsClient,
			}),
			false: httpBatchLink({
				url: "http://localhost:4000/trpc",
			}),
		}),
	]
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		AAA
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<App />
				</ThemeProvider>
			</QueryClientProvider>
		</trpc.Provider>
	</React.StrictMode>,
);
