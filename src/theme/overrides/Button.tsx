// ----------------------------------------------------------------------

import { Theme } from "@mui/material/styles";
import { pxToRem } from "utils/getFontValue";

export default function Button(theme: Theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {},
        },
        sizeLarge: {
          ...theme.typography.buttonLarge,
          padding: `${pxToRem(8)} ${pxToRem(30)}`,
          borderRadius: `6px`,
          height: `${pxToRem(42)}`,
        },
        sizeSmall: {
          ...theme.typography.buttonSmall,
          padding: `${pxToRem(4)} ${pxToRem(10)}`,
          borderRadius: `6px`,
          height: `${pxToRem(30)}`,

        },
        sizeMedium: {
          ...theme.typography.buttonMedium,
          padding: `${pxToRem(6)} ${pxToRem(16)}`,
          borderRadius: `4px`,
          height: `${pxToRem(36)}`,
        },
        defaultProps: "small",
        // contained
        containedInherit: {
          "&:hover": {},
        },
        containedPrimary: {},
        containedSecondary: {},
        containedInfo: {},
        containedSuccess: {},
        containedWarning: {},
        containedError: {},
        // outlined
        outlinedInherit: {
          "&:hover": {},
        },
        textInherit: {
          "&:hover": {},
        },
      },
    },
  };
}
