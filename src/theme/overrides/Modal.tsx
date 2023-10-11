// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Modal(theme: Theme) {
  return {
    MuiModal: {
      styleOverrides: {
        root: {},
      },
    },
  };
}
