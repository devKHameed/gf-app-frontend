// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Menu(theme: Theme) {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            "&:hover": {},
          },
        },
      },
    },
  };
}
