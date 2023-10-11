// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Progress(theme: Theme) {
  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: {},
        bar: {},
        colorPrimary: {},
        buffer: {},
      },
    },
  };
}
