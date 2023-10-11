import {
  Box,
  ButtonGroup,
  Divider,
  List,
  Drawer as MuiDrawer,
  Select,
  Stack,
} from "@mui/material";
import { CSSObject, Theme, styled } from "@mui/material/styles";
import ColorPicker from "components/ColorPicker";
import Scrollbar from "components/Scrollbar";
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
});
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
export const BoxWrap = styled(Stack)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minHeight: "0",
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

          ".header-id": {
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

export const DividerWrap = styled(Divider)(({ theme }) => ({
  borderColor: "#29292E",
}));
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

export const MenuListWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  background: theme.palette.background.LeftNavBody,
  padding: "9px 7px",
  alignItems: "center",
  color: theme.palette.text.primary,

  ".MuiDivider-root": {
    margin: "0 3px",
    height: "26px",
    background: theme.palette.background.GF20,
  },

  ".popup-opener": {
    background: "none",
    color: "inherit",
    minWidth: "inherit",
    gap: "2px",
    padding: "2px 6px",
    height: "auto",
    minHeight: "30px",
    opacity: "0.6",

    "&:hover": {
      background: theme.palette.background.SubNavHoverBG,
      opacity: "1",
    },

    svg: {
      height: "auto",
      width: "18px",
    },
  },
}));

export const MenuList = styled(List)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "0",
  fontSize: "15px",
  lineHeight: "24px",
  fontWeight: "400",

  li: {
    padding: "0",
    width: "auto",
    margin: "0 2px",

    "> .MuiListItemIcon-root": {
      alignItems: "center",
      justifyContent: "center",
      padding: "2px 6px",
      cursor: "pointer",
      transition: "all 0.4s ease",
      borderRadius: "4px",
      minWidth: "30px",
      minHeight: "30px",
      color: "inherit",
      opacity: "0.6",

      "&:hover": {
        background: theme.palette.background.SubNavHoverBG,
        opacity: "1",
      },

      svg: {
        height: "auto",
      },
    },
  },
}));

export const ContentBox = styled(Box)(({ theme }) => ({
  padding: "0 0 0 220px",
}));

export const ContentHolder = styled(Box)(({ theme }) => ({
  padding: "30px",
}));

export const ContentPreview = styled(Box)(({ theme }) => ({
  // padding: "50px",
  background: theme.palette.common.blackshades["100p"],
}));

export const SelectFont = styled(Select)(({ theme }) => ({
  "&.MuiInputBase-root": {
    background: "none",
    transition: "all 0.4s ease",

    "&:hover": {
      background: theme.palette.background.SubNavHoverBG,
    },

    ".MuiOutlinedInput-notchedOutline": {
      border: "none !important",
      outline: "none !important",
      boxShadow: "none",
    },
  },

  ".MuiSelect-select": {
    padding: "5px 4px 5px 8px",
    lineHeight: "20px",
  },

  ".MuiSvgIcon-root": {
    right: "0",
  },
}));

export const SelectIndent = styled(Select)(({ theme }) => ({
  "&.MuiInputBase-root": {
    background: "none",
    transition: "all 0.4s ease",

    "&:hover": {
      background: theme.palette.background.SubNavHoverBG,
    },

    ".MuiOutlinedInput-notchedOutline": {
      border: "none !important",
      outline: "none !important",
      boxShadow: "none",
    },
  },

  ".MuiSelect-select": {
    padding: "5px 4px 5px 8px",
    lineHeight: "20px",
    paddingRight: "26px !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    svg: {
      height: "14px",
      width: "auto",
    },
  },

  ".MuiSelect-icon": {
    right: "0",
  },
}));

export const FontSize = styled(ButtonGroup)(({ theme }) => ({
  padding: "0 9px",
  display: "flex",
  alignItems: "center",

  ".MuiButtonBase-root": {
    padding: "0",
    border: "none",
    outline: "none",
    minWidth: "18px",
    width: "18px",
    lineHeight: "18px",
    height: "18px",
    color: theme.palette.text.primary,
    opacity: "0.6",
    borderRadius: "3px !important",

    "&:hover": {
      border: "none",
      outline: "none",
      background: theme.palette.background.SubNavHoverBG,
    },

    svg: {
      width: "100%",
      height: "auto",
    },
  },

  ".MuiInput-root": {
    width: "38px",
    height: "28px",
    margin: "0 6px",

    "&:before, &:after": {
      display: "none",
    },
  },

  ".MuiInputBase-input": {
    width: "100%",
    height: "100%",
    background: theme.palette.common.blackshades["12p"],
    border: `1px solid ${theme.palette.background.GF60}`,
    color: theme.palette.text.primary,
    padding: "0",
    textAlign: "center",
    borderRadius: "3px",
  },
}));

export const ColorPickerHolder = styled(ColorPicker)(({ theme }) => ({
  "&.color-picker": {
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.4s ease",

    "&:hover": {
      background: theme.palette.background.SubNavHoverBG,
    },
  },

  ".gf-color-picker": {
    width: "auto",
  },

  ".MuiStack-root": {
    width: "18px",
    height: "18px",
    borderRadius: "3px",
    padding: "0",

    ".color": {
      width: "100%",
      height: "100%",
      borderRadius: "3px",
      border: "none",
    },

    svg: {
      display: "none",
    },
  },
}));

export const ScrollbarC = styled(Scrollbar)(({ theme }) => ({
  ".rc-scollbar": {
    padding: "18px",
  },

  ".SortableList ": {
    counterReset: "my-awesome-counter",
  },

  ".active_slide": {
    ".slide-holder": {
      borderColor: theme.palette.background.presentationActive,
    },
  },

  ".DragHandle": {
    position: "absolute",
    left: "0",
    width: "25px",
    top: "0",
    bottom: "0",
    cursor: "grab",

    svg: {
      opacity: "0",
      visibility: "hidden",
    },
  },

  ".SortableItem": {
    position: "relative",
    counterIncrement: "my-awesome-counter",
    padding: "0 0 0 25px",
    margin: "0 0 16px",

    "&:before": {
      content: `counter(my-awesome-counter)`,
      position: "absolute",
      left: "0",
      top: "50%",
      transform: "translate(0, -50%)",
      fontSize: "14px",
      lineHeight: "22px",
      fontWeight: "600",
    },
  },

  ".slide-holder": {
    height: "92px",
    background: theme.palette.background.default,
    border: `4px solid ${theme.palette.background.GF5}`,
    borderRadius: "8px",
    overflow: "hidden",

    "&.active": {
      borderColor: theme.palette.background.presentationActive,
    },

    img: {
      maxHeight: "100%",
      width: "100%",
      objectFit: "cover",
    },
  },
}));
export const ListItemStyle = styled(Box)(({ theme }) => ({}));
