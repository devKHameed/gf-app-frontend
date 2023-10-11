// ----------------------------------------------------------------------

import { Theme } from "@mui/material/styles";

export default function ButtonGroup(theme: Theme) {
  return {
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          "&:hover": {},
        },
      },
    },
  };
}
