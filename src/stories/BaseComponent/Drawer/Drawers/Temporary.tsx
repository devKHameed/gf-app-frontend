import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import * as React from "react";

type Anchor = "top" | "left" | "bottom" | "right";
interface Props extends DrawerProps {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  children: React.ReactElement;
  window?: () => Window;
}
export default function TemporaryDrawer(props: Props) {
  const { children, ...rest } = props;
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  return (
    <Box>
      {(["left", "right", "top", "bottom"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            {...rest}
          >
            {React.cloneElement(children, { toggleDrawer })}
          </Drawer>
        </React.Fragment>
      ))}
    </Box>
  );
}
