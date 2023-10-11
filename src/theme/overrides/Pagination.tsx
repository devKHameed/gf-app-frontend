import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Pagination(theme: Theme) {
  return {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          margin: '0 3px',
          "&.Mui-selected": {},
        },
        textPrimary: {
          "&.Mui-selected": {
            "&:hover, &.Mui-focusVisible": {},
          },
        },
        outlined: {},
        outlinedPrimary: {
          "&.Mui-selected": {},
        },
      },
    },
  };
}
