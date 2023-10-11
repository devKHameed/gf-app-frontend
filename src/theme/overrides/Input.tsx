// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";
export default function Input(theme: Theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            "& svg": {},
          },
        },
        input: {
          color: theme.palette.text.primary,

          "&::placeholder": {
            color: theme.palette.gfGrey.A200,
            opacity: "1",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {},
        sizeSmall: {},
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          background: theme.palette.background.GF5,
          border: "2px solid transparent",
          borderRadius: "5px",

          "&.MuiInputBase-sizeSmall": {
            input: {
              paddingTop: "6px",
              paddingBottom: "7px",
            },
          },

          ".MuiInputBase-inputSizeSmall": {},

          "&:before, &:after": {
            display: "none !important",
          },

          "&:hover": {
            background: theme.palette.background.GF10,
            border: "2px solid transparent",
          },

          "&.Mui-focused": {
            background: theme.palette.background.GF10,
            border: `2px solid ${theme.palette.text.primary_shades?.["30p"]}`,
          },
          "&.Mui-disabled": {},
        },
        underline: {
          "&:before": {},
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {},
          "&.Mui-disabled": {
            "& .MuiOutlinedInput-notchedOutline": {},
          },
        },
      },
    },
  };
}
