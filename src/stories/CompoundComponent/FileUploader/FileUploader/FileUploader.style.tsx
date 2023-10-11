import { Stack, styled } from "@mui/material";

export const RcStack = styled(Stack)(({ theme }) => {
  let isDark = theme.palette.mode === "dark";
  return {
    background: theme.palette.background.GFRightNavForeground,
    borderRadius: "4px",
  };
});

export const RcBox = styled(Stack)(({ theme }) => ({
  border: `1px dashed ${theme.palette.other?.divider}`,
  background: theme.palette.background.GFRightNavForeground,
  borderRadius: "4px",
}));
