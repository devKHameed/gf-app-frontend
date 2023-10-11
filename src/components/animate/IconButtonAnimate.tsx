import { m } from "framer-motion";
import { ForwardedRef, forwardRef, ReactNode } from "react";
// @mui
import { Box, IconButton, IconButtonProps } from "@mui/material";

// ----------------------------------------------------------------------
type IIconButtonAnimateProps = IconButtonProps & { [key: string]: any };
type IAnimateButtonProps = {
  children: ReactNode;
  size: IconButtonProps["size"];
};
const IconButtonAnimate = forwardRef(
  (
    { children, size = "medium", ...other }: IIconButtonAnimateProps,
    ref: ForwardedRef<any>
  ) => (
    <AnimateWrap size={size}>
      <IconButton size={size} ref={ref} {...other}>
        {children}
      </IconButton>
    </AnimateWrap>
  )
);

// IconButtonAnimate.propTypes = {
//   children: PropTypes.node.isRequired,
//   color: PropTypes.oneOf([
//     "inherit",
//     "default",
//     "primary",
//     "secondary",
//     "info",
//     "success",
//     "warning",
//     "error",
//   ]),
//   size: PropTypes.oneOf(["small", "medium", "large"]),
// };

export default IconButtonAnimate;

// ----------------------------------------------------------------------

const varSmall = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

const varMedium = {
  hover: { scale: 1.09 },
  tap: { scale: 0.97 },
};

const varLarge = {
  hover: { scale: 1.08 },
  tap: { scale: 0.99 },
};

// AnimateWrap.propTypes = {
//   children: PropTypes.node.isRequired,
//   size: PropTypes.oneOf(["small", "medium", "large"]),
// };

function AnimateWrap({ size, children }: IAnimateButtonProps) {
  const isSmall = size === "small";
  const isLarge = size === "large";

  return (
    <Box
      component={m.div}
      whileTap="tap"
      whileHover="hover"
      variants={(isSmall && varSmall) || (isLarge && varLarge) || varMedium}
      sx={{
        display: "inline-flex",
      }}
    >
      {children}
    </Box>
  );
}
