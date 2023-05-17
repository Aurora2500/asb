import { ThemeOptions, createTheme } from "@mui/material";


const themeOptions: ThemeOptions = {
	palette: {
		mode: "light",
	}
};

export const theme = createTheme(themeOptions);