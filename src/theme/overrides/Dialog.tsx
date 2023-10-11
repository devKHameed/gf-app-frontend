// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Dialog(theme: Theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        root: {
          ".MuiPaper-root": {
            margin: "20px",
            maxWidth: "calc(100% - 40px)",
            width: "calc(100% - 40px)",
          },

          ".form-scroller": {
            height: "calc(100vh - 176px) !important",
            background: theme.palette.background.GFTopNav,
          },
        },
      },
    },
    MuiDialogPaper: {
      styleOverrides: {
        root: {
          margin: "20px",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          background: theme.palette.background.GFRightNavForeground,
          padding: "10px 16px",
          minHeight: "60px",
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
          justifyContent: "space-between",

          [theme.breakpoints.down("sm")]: {
            padding: "10px 15px",
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          background: theme.palette.background.GFTopNav,
          padding: "20px 30px",
          paddingTop: "20px !important",

          [theme.breakpoints.down("sm")]: {
            padding: "10px 15px",
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          justifyContent: "center",
          padding: "20px",
          background: theme.palette.common.blackshades?.["12p"],

          ".MuiLoadingButton-loadingIndicator": {
            position: "static !important",
            margin: "0 8px 0 0",
          },
        },
      },
    },
  };
}
