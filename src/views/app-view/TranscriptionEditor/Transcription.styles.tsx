import {
  Box,
  ButtonGroup,
  Divider,
  List,
  Menu,
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
type MyThemeComponentProps = {
  progressposition?: number;
};
export const Progress = styled("div", {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: (prop) => true,
  name: "Progress",
})<MyThemeComponentProps>(({ theme, progressposition }: any) => ({
  "&.progress-line": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    height: "100%",
    background: `${theme.palette.background.GF20} !important`,
    margin: "0 0 0 1px",
    width: "1px",
  },
}));
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
    top: "223px",
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
  background: theme.palette.background.LeftNavBody,
  justifyContent: "space-between",
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
  padding: "6px 7px 6px 19px",
  alignItems: "center",
  justifyContent: "space-between",

  ".duration": {
    color: theme.palette.primary.main,
    fontWeight: "600",
    minWidth: "80px",
  },

  ".drawer-opener": {
    padding: "9px 12px",
    borderRadius: "4px",
    background: theme.palette.background.default,
    color: theme.palette.primary.main,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    border: `1px solid ${theme.palette.background.GFOutlineNav}`,

    svg: {
      margin: "0 10px 0 0",
      height: "auto",
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
    margin: "0 6px",
  },

  ".MuiListItemIcon-root": {
    minWidth: "inherit",
    width: "26px",
    height: "26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
    color: theme.palette.background.GF20,
    transition: "all 0.4s ease",
    cursor: "pointer",

    "&:hover": {
      background: theme.palette.background.GF80,
      color: theme.palette.warning.contrastText,
    },

    "&.rewind-track": {
      // background: theme.palette.background.GF60,
      color: theme.palette.warning.contrastText,

      "&:hover": {
        background: theme.palette.background.GF80,
      },
    },

    "&.play-track": {
      width: "35px",
      height: "35px",
      background: theme.palette.text.primary,
      color: theme.palette.warning.contrastText,
    },

    "&.shift-track": {
      margin: "0 10px",
    },
  },
}));

export const MenuListLink = styled(List)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "0 13px 0 0",
  fontSize: "15px",
  lineHeight: "24px",
  fontWeight: "400",

  li: {
    width: "auto",
    padding: "0 4px",

    a: {
      textDecoration: "none",
      color: theme.palette.common.white,
      padding: "3px 9px",
      width: "auto",
      cursor: "pointer",
      display: "block",
      transition: "all 0.4s ease",
      borderRadius: "4px",

      "&:hover": {
        background: theme.palette.background.GF10,
      },
    },
  },
}));

export const ContentBox = styled(Box)(({ theme }) => ({
  padding: "0 0 0 220px",
  position: "relative",
  overflow: "hidden",

  ".customscrollbar": {
    ">div:nth-child(2)": {
      pointerEvents: "none",
      opacity: "0",
      visibility: "hidden",
    },
  },

  ".thumb-horizontal": {
    opacity: "0",
    visibility: "hidden",
    pointerEvents: "none",
  },
}));

export const ContentHolder = styled(Box)(({ theme }) => ({
  padding: "6px 16px",
  borderBottom: `1px solid ${theme.palette.background.GF10}`,
  minHeight: "46px",

  ".title-item": {
    fontSize: "13px",
    lineHeight: "21px",
    padding: "6px",
    fontWeight: "500",
    background: theme.palette.background.LeftNavBody,
    color: theme.palette.text.primary,
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    position: "relative",

    "&:hover, &.active_tag": {
      background: theme.palette.primary.main,
    },

    "&:after": {
      position: "absolute",
      left: "-3px",
      bottom: "-6px",
      content: `""`,
      height: "1px",
      background: theme.palette.background.GF10,
      right: "0",
      display: "none",
    },

    "&:first-child:after": {
      left: "-16px",
    },

    "&:lastfirst-child:after": {
      right: "-16px",
    },
  },
}));

export const ContentPreview = styled(Box)(({ theme }) => ({
  // padding: "50px",
  background: theme.palette.common.blackshades["100p"],
}));

export const BoxWidth = styled(Box)(({ theme }) => ({
  width: `calc(50% - 110px)`,
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
  ".SortableItem": {
    margin: "0",
  },

  ".btn-holder": {
    padding: "9px 10px",

    ".MuiButton-root": {
      display: "block",
      padding: "3px 10px",
      background: theme.palette.background.GF5,
      color: theme.palette.background.GF80,
      fontSize: "12px",
      lineHeight: "22px",
      fontWeight: "500",
      height: "28px",
      width: "100%",
      boxShadow: "none",

      "&:hover": {
        background: theme.palette.background.GF20,
      },
    },
  },
}));

export const ListItemStyle = styled(Box)(({ theme }) => ({
  ".user-item": {
    padding: "9px 11px",
    minHeight: "46px",
    background: theme.palette.background.GF5,
    borderBottom: `1px solid ${theme.palette.background.GF10}`,
  },

  ".user-holder": {
    width: "100%",
  },

  ".MuiAvatar-root": {
    width: "26px",
    height: "26px",
    fontSize: "12px",
    lineHeight: "26px",
  },

  ".DragHandle ": {
    color: theme.palette.background.GF10,
    transition: "all 0.4s ease",

    "&:hover": {
      color: theme.palette.background.GF60,
    },
  },
}));

export const MuiDrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  background: theme.palette.background.LeftNavBody,
  justifyContent: "space-between",
  padding: "16px 16px 16px 20px",
  color: theme.palette.primary.main,

  ".MuiListItemIcon-root": {
    color: theme.palette.primary.main,
    minWidth: "inherit",

    svg: {
      height: "auto",
    },
  },

  ".drawer-close": {
    color: theme.palette.text.primary,
    cursor: "pointer",

    "&:hover": {
      opacity: "0.8",
    },
  },

  ".drawer-title": {
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    color: theme.palette.text.primary,

    svg: {
      margin: "0 10px 0 0",
      height: "auto",
    },
  },
}));

export const MuiDrawerBody = styled(Box)(({ theme }) => ({
  background: theme.palette.background.GFRightNavForeground,
  height: "calc(100% - 48px)",

  ".drawer-bodywrap": {
    padding: "12px 16px",
  },

  ".MuiPaper-root": {
    background: "none !important",
    boxShadow: "none !important",
    borderRadius: "0",
    padding: "0 0 8px",
  },

  ".MuiCardHeader-root": {
    padding: "0 0 13px",

    ".MuiCardHeader-avatar": {
      marginRight: "6px",
    },

    ".MuiAvatar-root": {
      width: "26px",
      height: "26px",
      fontSize: "13px",
      lineHeight: "26px",
    },
  },

  ".MuiCardContent-root": {
    padding: "0",
  },

  ".MuiTypography-root ": {
    fontSize: "13px",
    lineHeight: "22px",
    fontWeight: "500",
  },
}));

export const WaveWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  ".bars": {
    position: "absolute",
    left: "0",
    right: "0",
    top: "0",
    backgroundRepeat: "repeat-x",
    height: "8px",
    opacity: "0.2",

    "&.bottom": {
      top: "auto",
      bottom: "0",
      transform: "rotate(180deg)",
    },
  },

  ".cursor": {
    background: "#f00",
  },
}));

export const DurationBar = styled(Box)(({ theme }) => ({
  minHeight: "40px",
  background: theme.palette.background.GF36,
  fontSize: "9px",
  lineHeight: "12px",
  fontWeight: "600",
  color: theme.palette.text.secondary,
  position: "relative",
  overflow: "hidden",

  ".dots-wrapper": {
    minHeight: "inherit",
    padding: "0 5px",
  },

  ".marker": {
    width: "2px",
    height: "2px",
    borderRadius: "100%",
    display: "inline-block",
    verticalAlign: "middle",
    background: theme.palette.text.secondary,
  },

  ".progress-line": {
    background: `${theme.palette.background.GF60} !important`,
    margin: "0 0 0 1px",
  },
}));

export const ContextMenu = styled(Menu)(({ theme }) => ({
  ".MuiPaper-root ": {
    background: "none",
    boxShadow: "none",
    minWidth: "104px",
    padding: "10px 0 0",
  },

  ".context-menu-wrap": {
    position: "relative",
    background: theme.palette.background.LeftNavBody,
    borderRadius: "6px",

    "&:before": {
      position: "absolute",
      left: "50%",
      bottom: "100%",
      content: `""`,
      width: "0",
      height: "0",
      borderStyle: "solid",
      borderRight: "9px solid transparent",
      borderLeft: "9px solid transparent",
      borderBottom: `10px solid ${theme.palette.background.LeftNavBody}`,
      borderTop: "0",
    },
  },

  ".MuiList-root ": {
    padding: "0",

    "li.MuiButtonBase-root": {
      padding: "9px 12px",
      fontSize: "14px",
      lineHeight: "22px",
      fontWeight: "500",
      color: theme.palette.background.GF80,
      gap: "12px",

      "&:first-child": {
        borderRadius: "6px 6px 0 0",
      },

      "&:last-child": {
        borderRadius: "0 0 6px 6px",
      },

      svg: {
        width: "15px",
        height: "auto",
      },
    },
  },
  ".MuiCardHeader-root ": {
    padding: "0",
  },

  ".MuiCardHeader-avatar": {
    margin: "0 8px 0 0",

    svg: {
      width: "14px",
      height: "auto",
    },
  },

  ".action-btns": {
    ".MuiButtonBase-root": {
      minWidth: "87px",
      boxShadow: "none",
      height: "32px",
      fontSize: "14px",
      lineHeight: "18px",
    },

    ".btn-cancel": {
      color: theme.palette.text.secondary,
      background: theme.palette.background.GF5,
    },
  },
}));

export const ScrollWrapper = styled(Box)(({ theme }) => ({
  height: `calc(100vh - 226px)`,

  ".progress-line": {
    left: `calc(50% - 110px)`,
  },
}));
