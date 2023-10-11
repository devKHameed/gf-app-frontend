import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function AlertTitle(theme: Theme) {
  return {
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          // ...theme.typography.alertTitle,
        },
      },
    },
  };
}
