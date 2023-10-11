import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import SwipeableDrawer, {
  SwipeableDrawerProps
} from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";

const drawerBleeding = 56;

interface Props extends SwipeableDrawerProps {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function SwipeableEdgeDrawer(props: Props) {
  const { window, onOpen, onClose,...rest } = props;
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Stack spacing={3} alignItems="center">
      <Typography borderRadius={4} p={2} variant="subtitle1" color="grey.500">
        You can configure the SwipeableDrawer to have a visible edge when
        closed. If you are on a desktop, you can toggle the drawer with the
        "OPEN" button. If you are on mobile, you can open the demo in
        CodeSandbox ("edit" icon) and swipe.
      </Typography>
      <Root>
        <Global
          styles={{
            ".MuiDrawer-root > .MuiPaper-root": {
              height: `calc(50% - ${drawerBleeding}px)`,
              overflow: "visible",
            },
          }}
        />
        <Box sx={{ textAlign: "center", pt: 1 }}>
          <Button onClick={toggleDrawer(true)}>Open</Button>
        </Box>
        <SwipeableDrawer
          container={container}
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
          {...rest}
        >
          <StyledBox
            sx={{
              position: "absolute",
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: "visible",
              right: 0,
              left: 0,
            }}
          >
            <Puller />
            <Typography sx={{ p: 2, color: "text.secondary" }}>
              51 results
            </Typography>
          </StyledBox>
          <StyledBox
            sx={{
              px: 2,
              pb: 2,
              height: "100%",
              overflow: "auto",
            }}
          >
            <Skeleton variant="rectangular" height="100%" />
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    </Stack>
  );
}
