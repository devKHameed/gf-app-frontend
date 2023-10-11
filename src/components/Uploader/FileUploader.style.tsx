import { LinearProgress, Stack, styled } from "@mui/material";

export const RcStack = styled(Stack)(({ theme }) => {
  let isDark = theme.palette.mode === "dark";
  return {
    background: theme.palette.background.GF5,
    borderRadius: "5px",
    overflow: "hidden",
    position: "relative",
    padding: "12px 12px 12px 0",
    transition: "all 0.4s ease",

    "&:hover": {
      background: "#43434A",
      ".action-btns": {
        opacity: "1",
        visibility: "visible",
      },
    },

    ".icon-holder": {
      width: "60px",
      position: "relative",
      margin: "0 4px 0 0",
      padding: "0 12px",
      textAlign: "center",
      display: "flex",
      alingItems: "center",
      justifyContent: "center",
      color: theme.palette.background.GF80,

      "&:after": {
        position: "absolute",
        right: "1px",
        top: "50%",
        width: "1px",
        height: "40px",
        content: `""`,
        background: theme.palette.background.GF20,
        transform: "translate(0, -50%)",
      },

      img: {
        width: "40px",
        height: "40px",
        objectFit: "cover",
        borderRadius: "3px",
      },
    },

    ".file-detail": {
      flexGrow: "1",
      flexBasis: "0",
      minWidth: "0",
      padding: "0 0 0 12px",
    },

    ".file-name": {
      fontSize: "15px",
      lineHeight: "20px",
      fontWeight: "400",
      color: theme.palette.background.GF80,
      gap: "3px",
      wordBreak: "break-word",
      paddingRight: "10px",
    },

    ".file-size": {
      fontSize: "14px",
      lineHeight: "1.5",
      color: theme.palette.background.GF40,
    },

    ".action-btns": {
      opacity: "0",
      visibility: "hidden",
      transition: "all 0.4s ease",
      display: "flex",
      alingItems: "center",
    },

    ".MuiButtonBase-root": {
      padding: "0",
      width: "18px",
      color: theme.palette.background.GF60,
      transition: "all 0.4s ease",

      "&:hover": {
        color: theme.palette.text.primary,
      },

      svg: {
        maxWidth: "100%",
        height: "auto",
        display: "block",
      },
    },

    ".close-handler": {
      width: "18px",
      height: "18px",
      borderRadius: "100%",
      background: theme.palette.background.GF10,
      transition: "all 0.4s ease",
      padding: "3px",
      cursor: "pointer",
      margin: "0 4px 0 0",

      "&:hover": {
        background: theme.palette.text.primary_shades?.["30p"],
      },

      svg: {
        width: "100%",
        height: "auto",
        display: "block",
      },
    },
  };
});

export const RcBox = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.GF5,
  color: theme.palette.background.GF80,
  borderRadius: "5px",
  minHeight: "128px",
  textAlign: "center",
  padding: "15px",
  transition: "all 0.4s ease",
  display: "flex",
  alingItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  // border: "1px solid transparent",

  "&.dragging": {
    background: theme.palette.background.GF10,
    color: theme.palette.text.primary,
    // border: `1px dashed ${theme.palette.text.primary}`,

    "&:before": {
      opacity: "1",
      visibility: "visible",
    },
  },

  "&:before": {
    position: "absolute",
    left: "-4px",
    right: "-4px",
    top: "-4px",
    bottom: "-4px",
    content: `""`,
    border: "5px solid transparent",
    opacity: "0",
    visibility: "hidden",
    transition: "all 0.4s ease",
    pointerEvents: "none",
    lineHeight: "128px",
    background: `linear-gradient(to right, ${theme.palette.background.GF60} 50%, rgba(255, 255, 255, 0) 0%), linear-gradient(${theme.palette.background.GF60} 50%, rgba(255, 255, 255, 0) 0%), linear-gradient(to right, ${theme.palette.background.GF60} 50%, rgba(255, 255, 255, 0) 0%), linear-gradient(${theme.palette.background.GF60} 50%, rgba(255, 255, 255, 0) 0%)`,
    backgroundPosition: "top, right, bottom, left",
    backgroundRepeat: "repeat-x, repeat-y",
    backgroundSize: "10px 1px, 1px 10px",
  },

  "&:hover": {
    background: theme.palette.background.GF10,

    ".btn-holder": {
      color: theme.palette.background.GF80,
    },
  },

  ".heading": {
    lineHeight: "20px",
    fontWeight: "400",
    margin: "0 0 7px",
  },

  ".description-text": {
    fontSize: "13px",
    lineHeight: "16px",
    color: theme.palette.background.GF40,
  },

  ".btn-holder": {
    margin: "0 auto 13px",
    padding: "0",
    color: theme.palette.background.GF60,
    width: "29px",
    transition: "all 0.4s ease",

    svg: {
      width: "100%",
      height: "auto",
      display: "block",
    },
  },
}));

export const LinearProgressWrap = styled(LinearProgress)(({ theme }) => ({
  position: "absolute",
  bottom: "0",
  left: "0",
  right: "0",
  height: "2px",
  background: "none",
  borderRadius: "2px",

  ".MuiLinearProgress-bar": {
    background: theme.palette.text.secondary,
  },
}));
