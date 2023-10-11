// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function List(theme: Theme) {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {},
      },
    },
    MuiListItemAvatar: {
      styleOverrides: {
        root: {},
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {},
        multiline: {},
      },
    },
  };
}
