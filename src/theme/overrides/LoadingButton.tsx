// ----------------------------------------------------------------------

export default function LoadingButton() {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-text": {
            "& .MuiLoadingButton-startIconPendingStart": {},
            "& .MuiLoadingButton-endIconPendingEnd": {},
          },
        },
      },
    },
  };
}
