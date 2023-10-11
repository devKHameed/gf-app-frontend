import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import { CSSObject, Theme, alpha, styled } from "@mui/material/styles";
const drawerWidth = 220;
export const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

export const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: drawerWidth,
  // width: `calc(${theme.spacing(7)} + 1px)`,
  // [theme.breakpoints.up("sm")]: {
  //   width: `calc(${theme.spacing(8)} + 1px)`,
  // },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  background: theme.palette.background.LeftNavTop,
  //justifyContent: "flex-end",
  // padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,

  "&:hover": {
    ".MuiSelect-iconOutlined": {
      color: theme.palette.background.GF80,
      background: theme.palette.background.GFRightNavForeground,
    },
  },

  ".header-select-icon": {
    marginRight: "6px",
    width: "24px",
    height: "24px",
  },

  ".MuiSelect-iconOutlined": {
    width: "16px",
    height: "16px",
    top: "calc(50% - 8px)",
    right: "12px",
    borderRadius: "4px",
    color: theme.palette.background.GF60,
    transition: "all 0.4s ease",
  },
}));

export const MenuContainer = styled("div")(() => ({
  position: "relative",
  width: "100%",
  justifyContent: "center",
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ".rc-scollbar": {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    [`${theme.breakpoints.only("sm")},${theme.breakpoints.only("md")}`]: {
      overflowX: "hidden",
    },
  },

  ".MuiDrawer-paper": {
    top: "60px",
    bottom: "0",
    height: "auto",
    justifyContent: "space-between",
    // whiteSpace: "normal",
    background: theme.palette.background.LeftNavBody,

    // [`${theme.breakpoints.only("sm")},${theme.breakpoints.only("md")}`]: {
    //   whiteSpace: "nowrap",
    // },

    ".react-contextmenu-wrapper": {
      minWidth: "0",
    },

    ".header-select": {
      borderRadius: "0",
      background: theme.palette.background.LeftNavTop,

      ".MuiSelect-select ": {
        borderRadius: "0",
        fontSize: "14px",
        lineHeight: "18px",
        fontWeight: "600",
      },

      ".MuiSelect-icon ": {
        transform: "none !important",
      },
    },

    ".draggable-handle": {
      padding: "0 15px",
    },

    ".search-field": {
      ".MuiInputBase-root": {
        background: theme.palette.background.GF7,
        "&:not(:hover)": {
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
        },

        ".MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.background.GF40,
        },
      },

      ".MuiInputBase-input": {
        fontSize: "14px",
        lineHeight: "18px",
        fontWeight: "400",
        color: theme.palette.text.primary,
        padding: "5px 8px 5px 11px",

        "&:focus": {
          "&::placeholder": {
            color: "transparent",
            opacity: "0",
          },
        },

        "&::placeholder": {
          color: theme.palette.background.GF50,
          opacity: "1",
        },
      },

      ".MuiInputAdornment-root": {
        position: "absolute",
        right: "0",
        top: "0",
        height: "100%",
        padding: "0 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "auto",
        margin: "0",

        [`${theme.breakpoints.only("sm")},${theme.breakpoints.only("md")}`]: {
          padding: "0 8px",
        },
      },

      ".search-icon, .MuiInputAdornment-root": {
        color: theme.palette.background.GF60,

        "&:hover": {
          color: theme.palette.text.primary,
        },

        svg: {
          width: "16px",
          height: "16px",
        },
      },
    },

    "&:not(:hover):not(.is-dragging)": {
      [`${theme.breakpoints.only("sm")},${theme.breakpoints.only("md")}`]: {
        width: "60px !important",

        ".header-select": {
          fontSize: 0,
          lineHeight: 0,

          ".MuiSelect-iconOutlined": {
            opacity: 0,
            visibility: "hidden",
          },

          ".header-title": {
            display: "none",
          },

          ".MuiSelect-select": {
            paddingRight: "12px",
            justifyContent: "center",

            svg: {
              margin: "0",
            },
          },
        },

        ".search-field": {
          ".MuiInputBase-input": {
            color: "transparent",

            "&::placeholder": {
              color: "transparent",
            },
          },

          ".search-icon": {
            padding: "0 8px",
          },
        },

        ".MuiListItemText-root": {
          opacity: "0",
        },

        ".MuiListItemIcon-root": {
          minWidth: "25px",
          marginRight: "0",
        },

        ".box-holder": {
          maxWidth: "60px",
        },

        ".MuiAccordionSummary-content": {
          display: "none",
        },

        ".MuiAccordionSummary-expandIconWrapper": {
          // marginLeft: "4px",
        },

        ".overlay-holder": {
          display: "block",
          opacity: "1",
          visibility: "visible",
        },

        ".rc-scollbar": {
          overflowX: "hidden",
        },

        ".bottom-btns": {
          flexDirection: "column",
        },
      },
    },

    ".MuiListItemText-root": {
      [`${theme.breakpoints.only("sm")},${theme.breakpoints.only("md")}`]: {
        opacity: "1",
      },
    },

    [theme.breakpoints.down("sm")]: {
      top: "57px",
      position: "static",
      height: "calc(100vh - 57px)",
    },
  },

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    "& .MuiDrawer-paper": { width: "100%" },
  },
}));

export const ListItemStyle = styled(ListItem)<{
  dragOverlay?: boolean;
  fadeIn?: boolean;
  isActive?: boolean;
}>(({ dragOverlay, fadeIn, isActive, theme }) => ({
  display: "flex",
  boxSizing: "border-box",
  transform:
    "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))",
  transformOrigin: "0 0",
  touchAction: "manipulation",

  ".MuiButtonBase-root ": {
    "&:hover": {
      background: `${alpha(theme.palette.primary.main, 0.3)}`,
    },
  },

  ".draggable-handle ": {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: "50px",
    width: "auto",
    opacity: 0,
    zIndex: "2",
  },

  ".MuiListItemIcon-root": {
    width: "20px",
    height: "20px",

    svg: {
      width: "100%",
      height: "auto",
      display: "block",
    },
  },

  ...(isActive && {
    // background: "blue",
    [theme.breakpoints.up("sm")]: {
      ".MuiButtonBase-root ": {
        background: `${theme.palette.primary.shades?.["30p"]} !important`,

        "&:after": {
          position: "absolute",
          right: "0",
          top: "0",
          bottom: "0",
          width: "2px",
          content: `""`,
          background: theme.palette.primary.main,
          zIndex: "3",
        },

        ".MuiListItemIcon-root": {
          color: `${theme.palette.text.primary} !important`,
        },

        ".MuiListItemText-root": {
          color: `${theme.palette.text.primary} !important`,
        },
      },
    },
  }),
  ...(fadeIn && {
    "@keyframes fadeIn": {
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    },
    animation: "fadeIn 500ms ease",
  }),
  ...(dragOverlay && {
    "--scale": "1.05",
    "--boxShadow":
      "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)",
    "--boxShadowPickedUp":
      "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), -1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)",
    zIndex: "999",
  }),
}));

export const ListItemButtonWrap = styled(ListItemButton)(({ theme }) => ({
  "&:hover": {
    background: theme.palette.background.GF10,

    ".MuiListItemText-root": {
      color: theme.palette.background.GF80,
    },
  },

  "&.selected": {
    background: theme.palette.primary.shades?.["30p"],

    ".MuiListItemIcon-root": {
      color: theme.palette.text.primary,
    },

    ".MuiListItemText-root": {
      color: theme.palette.text.primary,
    },
  },

  ".MuiListItemIcon-root": {
    color: theme.palette.background.GF70,
  },

  ".MuiListItemText-root": {
    // color: theme.palette.background.GF60,
    color: "#a4a4a6",

    ".MuiTypography-root": {
      fontSize: "14px",
      lineHeight: "24px",
      fontWeight: "600",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "block",
    },
  },
}));
export const BottomSection = styled(Stack)(() => ({
  padding: "0 10px 10px 10px",
  gap: "10px",
  flexDirection: "row",
}));
export const DividerWrap = styled(Divider)(({ theme }) => ({
  borderColor: "#29292E",
}));

export const DrawerOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  zIndex: "9999999999",
  opacity: "0",
  visibility: "hidden",
  transition: "all 0.4s ease",
}));

export const AddButton = styled(Button)(({ theme }) => ({
  color: theme.palette.background.GF80,
  padding: "6px",
  minWidth: "inherit",

  "&:hover": {
    border: theme.palette.background.GF10,
    background: theme.palette.background.GF10,
  },

  svg: {
    width: "23px",
    height: "auto",

    [`${theme.breakpoints.only("sm")},${theme.breakpoints.only("md")}`]: {
      width: "18px",
    },
  },
}));

export const BoxWrap = styled(Stack)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minHeight: "0",
}));
