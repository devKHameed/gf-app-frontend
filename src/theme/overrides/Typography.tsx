// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Typography(theme: Theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        paragraph: {},
        gutterBottom: {},
        article: {},
      },
    },
  };
}
