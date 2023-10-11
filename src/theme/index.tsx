import { ReactNode } from "react";
// @mui
import { CssBaseline } from "@mui/material";
import {
  Direction,
  StyledEngineProvider,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";

// hooks
import useSettings from "hooks/useSettings";
//
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type {} from "@mui/x-date-pickers/themeAugmentation";

import useThemeToggle from "hooks/useThemeToggle";

// ----------------------------------------------------------------------

type IThemeProvider = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: IThemeProvider) {
  const { themeMode, themeDirection } = useSettings();

  const theme = useThemeToggle({
    themeDirection: themeDirection as Direction,
    themeMode: themeMode as ThemeModes,
  });
  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
