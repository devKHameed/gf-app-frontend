// ----------------------------------------------------------------------

import { Theme } from "@mui/material/styles";

export default function ControlLabel(theme: Theme) {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {},
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {},
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: `${theme.palette.background.GF80}`,
          },
        },
      },
    },
  };
}
