// ----------------------------------------------------------------------

import { Theme } from "@mui/material/styles";

export default function Avatar(theme: Theme) {
  return {
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
        },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        avatar: {
          "&:first-of-type": {
          },
        },
      },
    },
  };
}
