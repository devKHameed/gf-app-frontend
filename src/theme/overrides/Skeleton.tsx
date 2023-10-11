// ----------------------------------------------------------------------
import { Theme } from "@mui/material/styles";

export default function Skeleton(theme: Theme) {
  return {
    MuiSkeleton: {
      defaultProps: {},

      styleOverrides: {
        root: {},
      },
    },
  };
}
