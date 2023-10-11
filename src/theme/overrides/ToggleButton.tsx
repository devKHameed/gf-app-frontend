import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function ToggleButton(theme: Theme) {
  const style = (color: PaletteColorKeys) => ({
    props: { color },
    style: {
      "&:hover": {},
      "&.Mui-selected": {},
    },
  });

  return {
    MuiToggleButton: {
      variants: [
        {
          props: { color: "standard" },
          style: {
            "&.Mui-selected": {},
          },
        },
        style("primary"),
        style("secondary"),
        style("info"),
        style("success"),
        style("warning"),
        style("error"),
      ],
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          "& .MuiToggleButton-root": {},
        },
      },
    },
  };
}
