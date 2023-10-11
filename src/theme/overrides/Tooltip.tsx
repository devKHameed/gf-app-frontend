// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Tooltip(theme: Theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: theme.palette.gfGrey.GFBoxer,
          padding: "16px 20px"
        },
        arrow: {
          color: theme.palette.gfGrey.GFBoxer
        },
      },
    },
  };
}
