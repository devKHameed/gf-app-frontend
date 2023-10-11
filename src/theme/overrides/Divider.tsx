import { Theme } from '@mui/material/styles';
// ----------------------------------------------------------------------

export default function Drawer(theme: Theme) {
  return {
    MuiDivider: {
      styleOverrides: {
        modal: {},
      },
    },
  };
}
