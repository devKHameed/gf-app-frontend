import { Box, List, Stack, styled } from "@mui/material";

export const ContentBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  background: theme.palette.background.ContentArea,

  "&.side-nav-active": {
    paddingLeft: "220px",
    [`${theme.breakpoints.only("sm")},${theme.breakpoints.only("md")}`]: {
      paddingLeft: "60px",
    },
  },
}));

export const BoxWrap = styled(Box)(({ theme }) => ({
  ".MuiButton-outlined": {
    borderColor: theme.palette.text.primary_shades?.["30p"],
    background: theme.palette.background.GF10,
    minWidth: "62px",
    padding: "10px 5px 10px 12px",
    height: "40px",
    gap: "8px",

    "&:hover": {
      borderColor: theme.palette.background.GF60,
      background: theme.palette.background.GF20,

      ".arrow-holder": {
        color: theme.palette.text.primary,
      },
    },

    ".grid-icon ": {
      width: "18px",
      height: "auto",
    },

    ".arrow-holder": {
      color: theme.palette.text.secondary,
      width: "16px",
      height: "auto",
    },
  },
}));

export const MenuWrap = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  margin: "0 -14px 0 0",

  ".MuiDivider-root ": {
    borderColor: theme.palette.background.GF20,
  },
}));

export const MenuList = styled(List)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "0 13px 0 0",
  fontSize: "15px",
  lineHeight: "24px",
  fontWeight: "400",

  li: {
    padding: "3px 9px",
    width: "auto",
    margin: "0 4px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    borderRadius: "4px",

    "&:hover": {
      background: theme.palette.background.GF10,
    },
  },
}));

export const MenuIconsList = styled(List)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "0 0 0 15px",
  fontSize: "14px",
  lineHeight: "24px",
  fontWeight: "600",

  li: {
    padding: "0",
    width: "auto",
    margin: "0 4px",
  },

  ".MuiListItemButton-root,.MuiListItemIcon-root": {
    margin: "0",
    minWidth: "30px",
    minHeight: "30px",
    padding: "3px",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.text.primary,
    cursor: "pointer",
    borderRadius: "4px",
    textAlign: "center",

    ".button-text": {
      padding: "0 6px",
    },

    "&:hover": {
      background: theme.palette.background.GF10,
    },
  },

  ".MuiListItemButton-root": {
    background: theme.palette.background.GF10,
  },
}));
