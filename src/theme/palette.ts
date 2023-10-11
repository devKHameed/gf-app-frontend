import { createTheme } from "@mui/material/styles";
// import { darkPallete } from "./dark";
// import { lightPallete } from "./light";

// ----------------------------------------------------------------------
export const defualtTheme = (mode: "dark" | "light" = "dark") =>
  createTheme({
    // spacing: (factor: number) => `${0.25 * factor}rem`,
    palette: {
      mode,
    },
  });
export const defaultBlackTheme = defualtTheme("dark");
export const defaultLightTheme = defualtTheme("light");
// // SETUP COLORS
const AppThemes: Record<string, typeof defaultBlackTheme> = {
  light: require("./light").lightTheme,

  dark: require("./dark").darkTheme,
  blue: require("./blue").blueTheme,
};

export default AppThemes;
