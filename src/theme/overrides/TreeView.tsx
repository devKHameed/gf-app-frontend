import { Theme } from "@mui/material/styles";

export default function TreeView(theme: Theme) {
  return {
    MuiTreeView: {
      defaultProps: {},
    },
    MuiTreeItem: {
      styleOverrides: {
        label: {},
        iconContainer: {},
      },
    },
  };
}
