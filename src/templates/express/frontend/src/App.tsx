import React, { } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { trpc } from "trpc";

function App() {
	const {data} = trpc.hello.useQuery();
	const [clockTime, setClockTime] = React.useState("loading...");
	trpc.clock.useSubscription(undefined, {
		onData: data => setClockTime(data),
	});
	
	return (
		<>
			<AppBar position="fixed">
				<Toolbar>
					<Typography variant="h1"><%= projectName %></Typography>
				</Toolbar>
			</AppBar>
			<Toolbar />
			<Typography>backend data: {data || "loading..."}</Typography>
			<Typography>clock: {clockTime}</Typography>
		</>
	);
}

export default App;
