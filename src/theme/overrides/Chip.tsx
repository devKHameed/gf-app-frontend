import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Chip(theme: Theme) {
  // theme.palette.grey.
  return {
    MuiChip: {
      defaultProps: {
      },
      styleOverrides: {
        root: {
          fontStyle: 'normal',
          // fontFamily: 'Source Sans Pro',
          fontWeight: 400,
          fontSize: '13px',
          letterSpacing: '0px',
          textDecoration: 'none',
          lineHeight: '18px',
          textTransform: 'none',
        },
        
        colorDefault: {
          "& .MuiChip-avatarMedium, .MuiChip-avatarSmall": {},
        },
        outlined: {
          "&.MuiChip-colorPrimary": {},
          "&.MuiChip-colorSecondary": {},
        },
        //
        avatarColorInfo: {},
        avatarColorSuccess: {},
        avatarColorWarning: {},
        avatarColorError: {},
      },
    },
  };
}
