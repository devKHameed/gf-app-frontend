import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import {
  Box,
  Button,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SideNav from "components/layout-components/system-layout/SideNav";
import { SOCKET_URL } from "configs/AppConfig";
import useSocket from "hooks/useSocket";
import SystemAppBar from "module/Appbar";
import AccountMenu from "module/Menu";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { matchPath } from "react-router-dom";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import { getPathAfterFirstSlash, getSearchParams } from "utils";
import {
  BoxWrap,
  ContentBox,
  MenuIconsList,
  MenuList,
  MenuWrap,
} from "./SystemLayout.styles";

import { SocketState } from "enums";
import useAccountSlug from "hooks/useAccountSlug";
import useAppNavigate from "hooks/useAppNavigate";
import { SystemNavRoutes } from "routes";
import { useSocketStore } from "store/stores/socket";
import TwoPanelLayout, {
  LAYOUT_VIEW,
  TwoPanelLayoutRef,
} from "./AnimationLayout/TwoPanelLayout";

type Props = {
  sideNav?: boolean;
  RcAccountMenu?: boolean;
};
const navItems = [
  "File",
  "Edit",
  "View",
  "Insert",
  "Format",
  "Slide",
  "Arrange",
  "Tools",
  "Help ",
];
const getInitialComponent = () => {
  return getSearchParams().get("layout_c_name") || "left";
};
const MobileLayout = () => {
  const theme = useTheme();
  const view = useSystemLayoutStore.useActiveView();
  const goToLeftView = useSystemLayoutStore.useGoToLeftView();
  const location = useLocation();
  const accountSlug = useAccountSlug();

  const appBarProps = useSystemLayoutStore.useAppBarProps();

  const animationRef = useRef<TwoPanelLayoutRef | null>();

  useEffect(() => {
    animationRef.current?.gotoComponent(view);
  }, [view]);

  const getComponents = useCallback(() => {
    return {
      left: <SideNav />,
      right: (
        <ContentBox>
          <Outlet />
        </ContentBox>
      ),
    };
  }, []);
  const onBackClick = () => {
    //Todo: you can pass OnBackClick into useSystemLayoutStore
    goToLeftView();
  };
  const initialComponent = getInitialComponent();

  const title = useMemo(() => {
    const match = matchPath(
      `/${accountSlug}/dataset-design/*`,
      location.pathname
    );
    if (match) return "All Datasets";
  }, [location.pathname]);

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <SystemAppBar
        title={view === "right" ? title : "System Settings"}
        onLeftIconClick={onBackClick}
        DropDown={
          <AccountMenu
            DropDown={
              <BoxWrap>
                <Button
                  variant="outlined"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                  sx={{
                    borderRadius: "4px",
                    gap: "5px",
                    px: "5px",
                    borderColor: theme.palette.background.GF20,
                    background: theme.palette.background.GF7,
                  }}
                >
                  <GridViewOutlinedIcon className="grid-icon" />
                  <ExpandMoreIcon className="arrow-holder" />
                </Button>
              </BoxWrap>
            }
          />
        }
        {...appBarProps}
      />
      <TwoPanelLayout
        ref={animationRef as any}
        config={{
          getComponents,
          initialComponent: initialComponent as `${LAYOUT_VIEW}`,
        }}
        urlQueryKey="layout_c"
        dontUnmount={true}
        sx={{ height: "calc(100vh - 57px)", margin: "57px 0 0" }}
      />
    </Box>
  );
};
const ListingNavBar = () => {
  return (
    <MenuWrap>
      <MenuList>
        {navItems.map((ele, index) => {
          return <ListItem key={`${ele}-${index}`}>{ele}</ListItem>;
        })}
      </MenuList>
      <Divider orientation="vertical" />
      <MenuIconsList>
        <ListItem>
          <ListItemIcon>
            <RestoreOutlinedIcon sx={{ width: "18px", height: "auto" }} />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <MessageOutlinedIcon sx={{ width: "20px", height: "auto" }} />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <Box className="button-text">Slideshow</Box>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <RemoveRedEyeOutlinedIcon sx={{ width: "18px", height: "auto" }} />
          </ListItemButton>
        </ListItem>
      </MenuIconsList>
    </MenuWrap>
  );
};
const SystemLayout = ({ sideNav = true, RcAccountMenu = true }: Props) => {
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { connect, disconnect } = useSocket();
  const socketState = useSocketStore.useState();
  const location = useLocation();
  const appNavigate = useAppNavigate();

  const appBarProps = useSystemLayoutStore.useAppBarProps();
  const setSideNavSelectorOptions =
    useSystemLayoutStore.useSetSideNavSelectorOptions();
  const setSideNavSelectorProps =
    useSystemLayoutStore.useSetSideNavSelectorProps();
  const setSideNavSelectorValue =
    useSystemLayoutStore.useSetSideNavSelectorValue();

  useEffect(() => {
    if (socketState !== SocketState.Open) {
      connect(SOCKET_URL!);
      return () => {
        disconnect();
      };
    }
  }, []);

  useEffect(() => {
    setSideNavSelectorProps({
      onSelect(value) {
        appNavigate(`${value.key}`);
      },
    });

    const currentPath = getPathAfterFirstSlash(location.pathname);
    if (currentPath) {
      const mainRoute = SystemNavRoutes.find((route) => {
        if (
          currentPath.startsWith("/fusion-action") &&
          route.path === "/fusion"
        ) {
          return false;
        }
        return (
          currentPath.startsWith(route.path) ||
          route.children.some((c) => currentPath.startsWith(c.path))
        );
      });
      setSideNavSelectorOptions(
        mainRoute?.children.map((c) => ({
          key: c.path,
          title: c.name,
        })) || []
      );
      const selectedRoute = mainRoute?.children.find((c) =>
        currentPath.startsWith(c.path)
      );
      setSideNavSelectorValue({
        key: selectedRoute?.path,
        title: selectedRoute?.name,
      });
    }
  }, []);

  if (smScreen) {
    return <MobileLayout />;
  }

  return (
    <Box sx={{ height: "100%" }}>
      <SystemAppBar
        DropDown={
          RcAccountMenu ? (
            <AccountMenu
              DropDown={
                <BoxWrap>
                  <Button
                    variant="outlined"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    color="inherit"
                    sx={{
                      borderRadius: "4px",
                      gap: "5px",
                      px: "5px",
                      borderColor: theme.palette.background.GF20,
                      background: theme.palette.background.GF7,
                    }}
                  >
                    <GridViewOutlinedIcon className="grid-icon" />
                    <ExpandMoreIcon className="arrow-holder" />
                  </Button>
                </BoxWrap>
              }
            />
          ) : (
            <ListingNavBar />
          )
        }
        {...appBarProps}
      />
      <Toolbar />
      {sideNav ? <SideNav /> : null}
      <ContentBox
        sx={{ height: "calc(100% - 60px)" }}
        className={sideNav ? "side-nav-active" : ""}
      >
        <Outlet />
      </ContentBox>
    </Box>
  );
};

export default SystemLayout;
