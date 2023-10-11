// ----------------------------------------------------------------------

import { Theme } from "@mui/material";

export default function Accordion(theme: Theme) {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          "&.Mui-expanded": {},
          "&.Mui-disabled": {},
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            "& .MuiTypography-root": {},
          },
        },
        expandIconWrapper: {},
      },
    },
  };
}
