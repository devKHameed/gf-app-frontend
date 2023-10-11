import { Box, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { SxProps, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as React from "react";
import { RcStack } from "./Purchase.styled";

dayjs.extend(relativeTime);

type Props = {
  title?: string;
  subtitle?: string;
  timestamp?: string;
  icon?: React.ReactElement;
  iconSx?: SxProps;
};

const PurchaseToaster: React.FC<Props> = (props) => {
  const { title, subtitle, timestamp, icon, iconSx } = props;

  const theme = useTheme();

  const formattedTimestamp = React.useMemo(() => {
    return dayjs(timestamp).fromNow();
  }, [timestamp]);

  return (
    <RcStack flexDirection="row" alignItems="flex-start" gap={2}>
      <IconButton
        sx={{
          borderRadius: "4px",
          width: "36px",
          height: "36px",
          color: "grey.600",
          background: theme.palette.background.GF5,
          ":hover": { background: theme.palette.background.GF5 },
          ...iconSx,
        }}
      >
        {icon}
      </IconButton>
      <Box>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography
          variant="body2"
          sx={{ mb: 0.75, lineHeight: 1.6 }}
          color="text.secondary"
        >
          {subtitle}
        </Typography>
        <Tooltip title={timestamp} placement="top-start">
          <Typography variant="body2" color="text.secondary">
            {formattedTimestamp}
          </Typography>
        </Tooltip>
      </Box>
    </RcStack>
  );
};

export default PurchaseToaster;
