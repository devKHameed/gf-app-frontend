// import { InputSelectIcon } from "./CustomIcons";

// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";
export default function TextField(theme: Theme) {
  return {
    MuiTextField: {
      defaultProps: {
        // IconComponent: InputSelectIcon,
      },
      styleOverrides: {
        root: {
          cursor: "inherit",

          ".MuiInputBase-sizeSmall": {
            minHeight: "40px",

            ".MuiSelect-filled": {
              paddingTop: "6px",
              paddingBottom: "4px",
              minHeight: "36px",
              boxSizing: "border-box",
            },
          },

          ".MuiInputBase-multiline": {
            padding: "10px 4px",
            fontSize: "15px",
            lineHeight: "19px",
            cursor: "inherit",

            ".MuiInputBase-input ": {
              padding: "0 11px",
              fontWeight: "400",
              minHeight: "50px",
              cursor: "inherit",

              "&::-webkit-scrollbar": {
                width: "6px",
              },

              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },

              /* Handle */
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.background.GF20,
                borderRadius: "3px",

                "&:hover": {
                  cursor: "pointer",
                },
              },
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
          "&.Mui-focused": {},
          "&.Mui-disabled": {},
        },
        underline: {
          "&:before": {},
        },
      },
    },
  };
}
