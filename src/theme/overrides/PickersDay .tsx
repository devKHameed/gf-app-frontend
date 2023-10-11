import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function PickersDay(theme: Theme) {
  return {
    MuiPickersDay: {
      defaultProps: {},

      styleOverrides: {
        root: {
          background: "none",
        },
      },
    },
  };
}
