import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";

import List from "@mui/material/List";

import { ArrowBack } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import { alpha, IconButton, Stack, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ListItemStyle } from "components/layout-components/system-layout/SideNav/index.styles.";
import SearchInput from "components/SearchInput";
import GenericIcon from "components/util-components/Icon";
import { GUI_TYPE } from "constants/gui";
import { Icons } from "constants/index";
import { AnimatePresence, motion, Variants } from "framer-motion";
import useAccountSlug from "hooks/useAccountSlug";
import useAppNavigate from "hooks/useAppNavigate";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { ApiModels } from "queries/apiModelMapping";
import useListItems from "queries/useListItems";
import { useNavigate, useParams } from "react-router-dom";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import AccountSellector from "./AccountSellector";
import SettingMenu from "./SettingMenu";
const drawerWidth = 240;

type MenuInfo = {
  title: string;
  key: string;
  icon: Icons;
  children?: MenuInfo[];
};

function findMainObject(data: AppMenu, keyToMatch: string): MenuInfo[] | null {
  for (const item of data) {
    if (item.key === keyToMatch) {
      return [item as unknown as MenuInfo]; // Found a matching object at the current level
    }

    if (item.children) {
      const mainObjectPath = findMainObject(item.children, keyToMatch);
      if (mainObjectPath) {
        return [item as unknown as MenuInfo, ...mainObjectPath]; // Found a matching object in the children's children
      }
    }
  }

  return null; // No matching object found
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `60px`,
  // [theme.breakpoints.up("sm")]: {
  //   width: `calc(${theme.spacing(8)} + 1px)`,
  // },

  ".account-selector": {
    ".MuiSelect-icon, .MuiSelect-select": {
      opacity: "0",
    },

    ".logo-image": {
      width: "24px",
    },
  },

  ".MuiTypography-subtitle2": {
    opacity: "0",
  },

  ".MuiList-root": {
    ".MuiListItemIcon-root": {
      marginRight: "0",
    },
  },

  ".search-field": {
    ".MuiInputBase-input": {
      opacity: "0",
    },
  },

  ".top-nav": {
    ".nav-title, .gui-image": {
      opacity: "0",
    },

    ".MuiIconButton-root": {
      left: "19px",
    },
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  background: theme.palette.primary.main,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,

  ".account-selector": {
    background: theme.palette.background.GF10,
    position: "relative",
    height: "100%",
    display: "flex",
    alignItems: "center",

    ".logo-image": {
      width: "16px",
      height: "auto",
      position: "absolute",
      left: "15px",
      top: "50%",
      transform: "translate(0, -50%)",
      transition: "all 0.4s ease",
    },

    ".MuiInputBase-root": {
      flexGrow: "1",
      flexBasis: "0",
      minWidth: "0",
      padding: "0",
      background: "none !important",
      height: "100%",
    },

    ".MuiSelect-select": {
      flexGrow: "1",
      flexBasis: "0",
      minWidth: "0",
      padding: "15px 15px 15px 51px",
      background: "none !important",
      height: "100%",
      display: "flex",
      alignItems: "center",
      transition: "all 0.4s ease",
    },

    ".MuiSelect-icon": {
      width: "16px",
      height: "auto",
      position: "absolute",
      right: "15px",
      top: "50%",
      transition: "all 0.4s ease",
      transform: "translate(0, -50%)",
      color: theme.palette.common.white,
    },
  },
}));

const NavWrap = styled(Stack)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minHeight: "0",

  ".MuiList-root": {
    padding: "0",

    ".MuiButtonBase-root": {
      minHeight: "40px",
      color: theme.palette.text.secondary,
      position: "relative",
      borderRight: "2px solid transparent",
      borderLeft: "2px solid transparent",
      padding: "8px 18px",

      "&:hover": {
        background: theme.palette.primary.shades?.["30p"],
        color: theme.palette.text.primary,
      },

      "&.active": {
        background: theme.palette.primary.shades?.["30p"],
        borderRightColor: theme.palette.primary.main,
      },
    },

    ".MuiListItemIcon-root": {
      marginRight: "12px",
      width: "20px",
      color: theme.palette.text.secondary,

      svg: {
        maxWidth: "100%",
        height: "auto",
        display: "block",
        margin: "0 auto",
      },
    },

    ".MuiListItemText-root ": {
      margin: "0",
    },

    ".MuiTypography-root": {
      fontSize: "15px",
      lineHeight: "22px",
      fontWeight: "600",
    },
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
      padding: "0 8px",
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
}));

const BottomSection = styled("div")(() => ({}));

const MenuContainer = styled("div")(() => ({
  position: "relative",
  flexGrow: "1",
  flexBasis: "0",
  minHeight: "0",
  overflow: "hidden",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  boxShadow: "none !important",

  ".MuiDrawer-paper": {
    boxShadow: "none !important",
    background: theme.palette.background.LeftNavTop,
  },

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const variants: Variants = {
  enter: (direction: number) => {
    return {
      left: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    left: "0",
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      position: "absolute",
      zIndex: 0,
      left: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
};

const MenuList: React.FC<{
  open: boolean;
  items: { title: string; key: string; icon: Icons }[];
  onMenuClick: (_: MenuInfo) => void;
}> = ({ open, items = [], onMenuClick }) => {
  const { isActive } = useSystemLayoutStore.useItemProps?.() || {};
  return (
    <List>
      {items.map((item, idx) => {
        return (
          <ListItemStyle
            key={item.key || idx}
            disablePadding
            sx={{ display: "block" }}
            onClick={() => onMenuClick(item)}
            isActive={isActive?.(item)}
          >
            {/* <AccountLink to={`/${item.key}`}> */}
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <GenericIcon iconName={item.icon} />
              </ListItemIcon>

              <ListItemText
                primary={item.title}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
            {/* </AccountLink> */}
          </ListItemStyle>
        );
      })}
    </List>
  );
};

const NavConatainer = styled("div")(({ theme }) => ({
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },

  ".search-field": {
    padding: "11px 14px",
  },
}));

const NavTopSection = styled("div")(({ theme }) => ({
  width: "100%",
  padding: "13px 13px 13px 52px",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: alpha(theme.palette.common.black, 0.2),

  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },

  ".gui-image": {
    width: "20px",
    height: "auto",
    display: "block",
  },

  ".MuiButtonBase-root ": {
    width: "22px",
    height: "22px",
    minWidth: "22px",
    borderRadius: "4px",
    background: theme.palette.background.GF10,
    position: "absolute",
    left: "15px",
    top: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "translate(0, -50%)",
    color: theme.palette.background.GF80,
    padding: "0",

    "&:hover": {
      background: theme.palette.background.GF20,
      color: theme.palette.text.primary,
    },

    svg: {
      width: "15px",
      height: "auto",
      display: "block",
    },
  },
}));
const NavTitle = styled("div")(({ theme }) => ({
  fontSize: "15px",
  lineHeight: "22px",
}));

const ManuNavBar = ({
  open,
  title,
  iconName,
  handleBackClick,
}: {
  title: string;
  iconName: Icons;
  handleBackClick: () => void;
  open: boolean;
}) => {
  return (
    <NavConatainer>
      <NavTopSection className="top-nav">
        <IconButton onClick={handleBackClick} className="back-btn">
          <ArrowBack />
        </IconButton>
        <NavTitle className="nav-title">{title}</NavTitle>
        <GenericIcon iconName={iconName} className="gui-image" />
      </NavTopSection>
      <SearchInput
        id="outlined-adornment-password"
        placeholder="Search..."
        size="small"
        sx={{ m: 0 }}
        // onChange={debounce((e) => {
        //   handleSeach(e.target.value);
        // }, 300)}
      />
    </NavConatainer>
  );
};

const BoxTitle = styled(Typography)(({ theme }) => ({
  padding: "8px 20px",
  fontSize: "13px",
  lineHeight: "22px",
  fontWeight: "600",
  color: theme.palette.background.GF40,
}));

const AppMenu = ({
  open,
  onMenuClick,
  items,
  index = 0,
  selectedItem,
  handleBackClick,
}: {
  open: boolean;
  items: { title: string; key: string; icon: Icons }[];
  onMenuClick: (_: MenuInfo) => void;
  handleBackClick: () => void;
  index: number;
  selectedItem: { title: string; key: string; icon: Icons };
}) => {
  return (
    <Box className="menu-group">
      {index === 0 && <BoxTitle variant="subtitle2">MY APPS</BoxTitle>}
      {index !== 0 && (
        <ManuNavBar
          open={open}
          title={selectedItem.title}
          iconName={selectedItem.icon}
          handleBackClick={handleBackClick}
        />
      )}
      <MenuList items={items} onMenuClick={onMenuClick} open={open} />
    </Box>
  );
};
export default function SideNav() {
  const navigate = useNavigate();

  const rawMenu = useSystemLayoutStore.useMenu();
  const { onClick: onItemClick } = useSystemLayoutStore.useItemProps?.() || {};
  const [appMenu, setAppMenu] = useState<AppMenu>([]);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<MenuInfo[]>([]);
  const [direction, setDirection] = useState(1);
  const accountSlug = useAccountSlug();
  const [useDynamicMenu, setUseDynamicMenu] = useState<boolean>(false);
  const appNavigate = useAppNavigate();
  const { slug: guiSlug } = useParams<{ slug: string }>();
  const initialValueSet = useRef(false);
  const { data: guis } = useListItems({
    modelName: ApiModels.Gui,
    queryKey: [accountSlug, ApiModels.Gui],
  });

  const { data: folders } = useListItems({
    modelName: ApiModels.Folder,
    queryKey: [accountSlug, ApiModels.Folder, ApiModels.Gui],
    requestOptions: { query: { resource: ApiModels.Gui } },
  });

  useEffect(() => {
    if (folders && guis) {
      setAppMenu(
        folders.map((f) => ({
          title: f.name,
          icon: "Inbox",
          key: f.slug,
          children: guis
            .filter((g) => f.childs?.some((ff) => ff.slug === g.slug))
            .map((g) => ({
              title: g.name,
              icon: g.icon || "Menu",
              key: g.slug,
            })),
        }))
      );
    }
  }, [guis, folders]);

  useEffect(() => {
    if (appMenu && guiSlug && !initialValueSet.current) {
      const objectFound = findMainObject(appMenu, guiSlug);
      if (objectFound) {
        setDirection(1);
        setTimeout(() => {
          setSelected(objectFound);
          setUseDynamicMenu(true);
        });
        initialValueSet.current = true;
      }
    }
  }, [guiSlug, appMenu]);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuClick = (m: MenuInfo) => {
    if (useDynamicMenu) {
      onItemClick?.(m);
      return;
    }
    if (!!m.children?.length) {
      setUseDynamicMenu(false);
      setDirection(1);
      setTimeout(() => setSelected((item) => [...item, m]));
    } else {
      const gui = guis?.find((g) => g.slug === m.key);
      if (gui) {
        // useSystemLayoutStore.setState({ menu: [] });
        if (gui.gui_type === GUI_TYPE.DASHBOARD) {
          appNavigate(`/gui-module-public/${gui.slug}/dashboard`);
        } else if (gui.gui_type === GUI_TYPE.DATASET_LIST) {
          appNavigate(
            `/gui-module-public/${gui.slug}/document-list/${gui.parent_app_id}`
          );
        }
        if (gui.gui_type !== GUI_TYPE.DASHBOARD) {
          setDirection(1);
          setTimeout(() => setSelected((item) => [...item, m]));
          setTimeout(() => setUseDynamicMenu(true), 0);
        }
      }
    }
  };
  const handleBackClick = () => {
    if (useDynamicMenu) appNavigate("/app");
    setDirection(-1);
    setTimeout(() => {
      setSelected((item) => {
        item.pop();
        return [...item];
      });
      if (useDynamicMenu) {
        setUseDynamicMenu(false);
      }
    });
  };

  return (
    // <Box onMouseEnter={handleDrawerOpen} onMouseLeave={handleDrawerClose}>
    <Box>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <AccountSellector />
        </DrawerHeader>
        <NavWrap direction="column" justifyContent="space-between">
          <MenuContainer>
            <AnimatePresence initial={false}>
              <motion.div
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  mass: 0.2,
                  duration: 0.4,
                }}
                key={useDynamicMenu ? "dynamic" : selected.length}
                style={{ height: "100%", position: "relative", width: "100%" }}
              >
                <AppMenu
                  open={open}
                  onMenuClick={handleMenuClick}
                  handleBackClick={handleBackClick}
                  index={selected.length}
                  selectedItem={selected[selected.length - 1]}
                  items={
                    useDynamicMenu
                      ? rawMenu
                      : selected.length === 0
                      ? (appMenu as any)
                      : selected[selected.length - 1]?.children || []
                  }
                />
              </motion.div>
            </AnimatePresence>
          </MenuContainer>
          <BottomSection>
            <List>
              <ListItem
                key={"setting"}
                disablePadding
                sx={{ display: "block" }}
              >
                <PopupState variant="popover" popupId="demo-popup-menu">
                  {(popupState) => (
                    <React.Fragment>
                      <ListItemButton
                        sx={{
                          justifyContent: open ? "initial" : "center",
                        }}
                        {...bindTrigger(popupState)}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={"Setting"}
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                      </ListItemButton>
                      <SettingMenu {...bindMenu(popupState)} />
                    </React.Fragment>
                  )}
                </PopupState>
              </ListItem>
            </List>
          </BottomSection>
        </NavWrap>
      </Drawer>
    </Box>
  );
}
