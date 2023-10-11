import { Paper, styled } from "@mui/material";

export const ListBox = styled(Paper)(({ theme }) => {
  const isdark = theme.palette.mode === "dark";
  let styles: any = {
    background: "transparent",
  };
  if (!isdark) {
    styles = {
      background: theme.palette.gfGrey.GF50,
      "&:hover": {
        background: theme.palette.gfGrey.GF75,
      },
    };
  }

  return {
    ...styles,
  };
});
