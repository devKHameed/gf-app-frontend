import {
  Box,
  BoxProps,
  CircularProgress,
  CircularProgressProps,
  Stack,
} from "@mui/material";
import React, { PropsWithChildren } from "react";

type Props = {
  spinning?: boolean;
  iconProps?: CircularProgressProps;
} & BoxProps;

const Spin: React.FC<PropsWithChildren<Props>> = (props) => {
  const { spinning, children, iconProps = {}, ...rest } = props;

  return (
    <Box sx={{ position: "relative" }} {...rest}>
      {spinning && (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            height: "100%",
            width: "100%",
            backgroundColor: "#00000040",
            position: "absolute",
            zIndex: "9",
          }}
          onClick={(e) => e.preventDefault()}
        >
          <CircularProgress {...iconProps} />
        </Stack>
      )}
      {children}
    </Box>
  );
};

export default Spin;
