// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Tabs(theme: Theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "42px",
        },
        scrollButtons: {},
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: "600",
          fontSize: "15px",
          minHeight: "42px",
          paddingTop: "9px",
          paddingBottom: "9px",
          textTransform: "none",
          "&.Mui-selected": {},
          "&:not(:last-of-type)": {},
          "@media (min-width: 600px)": {},
        },
        labelIcon: {
          "& > *:first-of-type": {},
        },
        wrapped: {},
        textColorInherit: {},
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {},
      },
    },
  };
}
