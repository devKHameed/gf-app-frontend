// import { InputSelectIcon } from "./CustomIcons";

// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";
export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      defaultProps: {
        // IconComponent: InputSelectIcon,
      },
      styleOverrides: {
        root: {
          background: theme.palette.background.GF5,
          border: "none",
          borderRadius: "5px",
          paddingTop: "0",

          "&.MuiInputBase-sizeSmall": {
            minHeight: "40px",

            ".MuiSelect-filled": {
              paddingTop: "4px",
            },
          },

          ".MuiInputBase-inputSizeSmall": {},

          "&:before, &:after": {
            display: "none !important",
          },

          "&:hover": {
            // background: theme.palette.background.GF5,
            border: "none",
          },
          "&.Mui-focused": {
            background: theme.palette.background.GF5,
            border: "none",
          },
          "&.Mui-disabled": {},
        },
        underline: {
          "&:before": {},
        },
      },
    },
  };
}
