// icons
import { Icon, IconifyIcon } from "@iconify/react";
// @mui
import { Box, SxProps } from "@mui/material";

// ----------------------------------------------------------------------

type IconifyType = {
  icon: IconifyIcon | string;
  sx?: SxProps;
  [key: string]: any;
};

export default function Iconify({ icon, sx = {}, ...other }: IconifyType) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}
