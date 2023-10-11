import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import SideNav from "components/layout-components/app-layout/SideNav";
import { SOCKET_URL } from "configs/AppConfig";
import { SocketState } from "enums";
import useSocket from "hooks/useSocket";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSocketStore } from "store/stores/socket";

const AppLayout = () => {
  const { connect, disconnect } = useSocket();
  const socketState = useSocketStore.useState();

  useEffect(() => {
    if (socketState !== SocketState.Open) {
      connect(SOCKET_URL!);
      return () => {
        disconnect();
      };
    }
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SideNav />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar>
            <Toolbar sx={{ left: "240px" }}>
              <Typography variant="h6" noWrap component="div">
                Responsive drawer
              </Typography>
            </Toolbar>
          </AppBar>
          <Box component="main" sx={{ p: 3, mt: 8 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
