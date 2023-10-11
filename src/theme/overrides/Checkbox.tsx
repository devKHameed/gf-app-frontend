import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Checkbox(theme: Theme) {
  return {
    MuiCheckbox: {
      defaultProps: {},

      styleOverrides: {
        root: {
          "&.Mui-checked.Mui-disabled, &.Mui-disabled": {},
          "& .MuiSvgIcon-fontSizeMedium": {},
          "& .MuiSvgIcon-fontSizeSmall": {},
          svg: {
            "&[font-size=small]": {},
          },
        },
      },
    },
  };
}
