// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Switch(theme: Theme) {
  return {
    MuiSwitch: {
      styleOverrides: {
        thumb: {},
        track: {},
        switchBase: {
          "&:not(:.Mui-checked)": {},
          "&.Mui-checked.Mui-disabled, &.Mui-disabled": {},
          "&.Mui-disabled+.MuiSwitch-track": {},
        },
      },
    },
  };
}
