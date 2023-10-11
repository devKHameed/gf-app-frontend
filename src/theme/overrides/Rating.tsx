// import { StarIcon } from "./CustomIcons";

// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Rating(theme: Theme) {
  return {
    MuiRating: {
      defaultProps: {
        // emptyIcon: <StarIcon />,
        // icon: <StarIcon />,
      },

      styleOverrides: {
        root: {
          "&.Mui-disabled": {},
        },
        iconEmpty: {},
        sizeSmall: { "& svg": {} },
        sizeLarge: { "& svg": {} },
      },
    },
  };
}
