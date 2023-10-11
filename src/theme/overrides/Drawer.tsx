import { Theme } from "@mui/material/styles";
// ----------------------------------------------------------------------

export default function Drawer(theme: Theme) {
  return {
    MuiDrawer: {
      styleOverrides: {
        root: {
          ".MuiPaper-root": {
            background: `${
              theme.palette.mode === "dark"
                ? "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%), #121212"
                : theme.palette.background.default
            }`,
            boxShadow:
              "0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)",
            border: "none",
          },
        },
        modal: {
          '&[role="presentation"]': {
            "& .MuiDrawer-paperAnchorLeft": {},
            "& .MuiDrawer-paperAnchorRight": {},
          },
        },
      },
    },
  };
}
