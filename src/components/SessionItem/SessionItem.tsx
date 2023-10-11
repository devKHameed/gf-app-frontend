import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import React, { useMemo } from "react";
interface Props {
  status?: string;
  timestamp?: string;
  title?: string;
  errorCount?: number;
}

const SessionStatusInfo: React.FC<{ status: string; errorCount?: number }> = (
  props
) => {
  const { status, errorCount } = props;
  const theme = useTheme();

  switch (status) {
    case "Pending":
      return (
        <Stack
          direction={"row"}
          spacing={0.75}
          alignItems="center"
          color={theme.palette.orange.Status}
        >
          <MoreHorizOutlinedIcon sx={{ width: "18px", height: "auto" }} />
          <Typography component="div" variant="body2">
            Pending
          </Typography>
        </Stack>
      );

    case "Error":
      return (
        <Stack
          direction={"row"}
          spacing={1}
          alignItems="center"
          color={theme.palette.red.Error}
        >
          <InfoOutlinedIcon sx={{ width: "18px", height: "auto" }} />
          <Typography component="div" variant="body2">
            Errors: {errorCount}
          </Typography>
        </Stack>
      );

    case "Complete":
      return (
        <Stack
          direction={"row"}
          spacing={1}
          alignItems="center"
          color={theme.palette.green.GFShocking}
        >
          <DoneOutlinedIcon sx={{ width: "18px", height: "auto" }} />
          <Typography component="div" variant="body2">
            Complete
          </Typography>
        </Stack>
      );

    default:
      return <></>;
  }
};

const SessionItem: React.FC<Props> = (props) => {
  const { status = "", timestamp, title } = props;
  const theme = useTheme();

  const time = useMemo(() => {
    return moment(timestamp).format("HH:mm A");
  }, [timestamp]);

  return (
    <Stack
      direction={"row"}
      alignItems="center"
      justifyContent="space-between"
      py={0.75}
      px={1.5}
      borderRadius="6px"
      bgcolor={theme.palette.background.GF5}
      sx={{ cursor: "pointer" }}
    >
      <Stack direction={"column"}>
        <Stack direction={"row"} spacing={1.25}>
          <Typography variant="subtitle1" color="text.secondary">
            {time}
          </Typography>
          <Typography component="div" variant="subtitle1">
            {title}
          </Typography>
        </Stack>
        <SessionStatusInfo status={status} />
      </Stack>
      <IconButton size="small">
        <ArrowForwardIosOutlinedIcon sx={{ width: "12px", height: "12px" }} />
      </IconButton>
    </Stack>
  );
};

export default SessionItem;
