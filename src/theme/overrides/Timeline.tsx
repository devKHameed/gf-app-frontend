// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Timeline(theme: Theme) {
  return {
    MuiTimelineDot: {
      styleOverrides: {
        root: {},
      },
    },

    MuiTimelineConnector: {
      styleOverrides: {
        root: {},
      },
    },
  };
}
