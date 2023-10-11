import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Alert(theme: Theme) {
  // const standardStyle = (color: PaletteColorKeys) => ({
  //   "& .MuiAlert-icon": {},
  // });

  // const filledStyle = (color: PaletteColorKeys) => ({
  //   // color: theme.palette[color].contrastText,
  // });

  // const outlinedStyle = (color: PaletteColorKeys) => ({
  //   "& .MuiAlert-icon": {},
  // });

  return {
    MuiAlert: {
      defaultProps: {},

      styleOverrides: {
        root: {
          borderRadius: "4px",
        },
        message: {
          "& .MuiAlertTitle-root": {
            // ...theme.components?.MuiAlertTitle
          },
        },
        action: {
          "& button:not(:first-of-type)": {},
        },

        // standardInfo: standardStyle("info"),
        // standardSuccess: standardStyle("success"),
        // standardWarning: standardStyle("warning"),
        // standardError: standardStyle("error"),

        // filledInfo: filledStyle("info"),
        // filledSuccess: filledStyle("success"),
        // filledWarning: filledStyle("warning"),
        // filledError: filledStyle("error"),

        // outlinedInfo: outlinedStyle("info"),
        // outlinedSuccess: outlinedStyle("success"),
        // outlinedWarning: outlinedStyle("warning"),
        // outlinedError: outlinedStyle("error"),
      },
    },
  };
}
