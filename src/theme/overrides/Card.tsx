// ----------------------------------------------------------------------

import { Theme } from "@mui/material/styles";

export default function Card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {},
        subheaderTypographyProps: {
        },
      },
      styleOverrides: {
        root: {
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
        },
      },
    },
  };
}
