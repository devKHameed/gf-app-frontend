// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Stepper(theme: Theme) {
  return {
    MuiStepper: {
      styleOverrides: {
        root: {
          ".MuiStepLabel-label.Mui-active": {
            fontWeight: "600",
          },
        },
        line: {},
      },
    },
  };
}
