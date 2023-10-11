import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { SxProps, useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { SortableList } from "components/SortableList";
import { forwardRef, ReactElement, ReactNode } from "react";

// import { DragSourceMonitor, useDrag } from "react-dnd";
type IProfileCardProps = {
  options?: {
    draggable: boolean;
    switcher: boolean;
  };
  title: string;
  subTitle?: string | ReactNode | ReactElement;
  rightIcon?: ReactNode | ReactElement;
  AvatarImage?: string | ReactNode | ReactElement;
  sx?: SxProps;
  onClick?(): void;
  selected?: boolean;
  DragHandle?: ReactElement;
};
const ProfileCard = forwardRef((props: IProfileCardProps, ref: any) => {
  const theme = useTheme();
  const {
    options = { draggable: true, switcher: false },
    title,
    subTitle,
    rightIcon,
    AvatarImage,
    sx,
    onClick,
    selected = false,
    DragHandle,
  } = props;
  // const [{ opacity }, drag, preview] = useDrag(() => ({
  //   type: "profileCard",
  //   collect: (monitor: DragSourceMonitor<unknown, unknown>) => ({
  //     opacity: monitor.isDragging() ? 0.4 : 1,
  //   }),
  // }));

  return (
    <Box onClick={onClick}>
      <Stack
        className={`${selected ? "active" : ""} record-item`}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={1}
        py={0.875}
        sx={{
          background: theme.palette.background.GF5,
          borderRadius: "6px",
          border: "1px solid transparent",
          "&:hover": {
            background: theme.palette.background.GF7,
          },
          "&.active": {
            borderColor: theme.palette.orange.GFOrange,
          },
          ...sx,
        }}
      >
        {/* <Stack ref={preview} style={{ opacity }}> */}
        {/* {options?.draggable && <DragIndicatorIcon ref={drag} />} */}
        <Stack
          direction="row"
          alignItems="center"
          className="card-inner-content"
        >
          {(AvatarImage || options?.draggable) && (
            <Stack direction="row" alignItems="center" mr={0.75}>
              {options?.draggable &&
                (DragHandle ? (
                  DragHandle
                ) : (
                  <SortableList.DragHandle>
                    <DragIndicatorIcon
                      sx={{
                        verticalAlign: "middle",
                        color: theme.palette.background.GF20,
                        cursor: "grab",
                      }}
                    />
                  </SortableList.DragHandle>
                ))}
              {options?.switcher && <Switch />}
              {typeof AvatarImage === "string" ? (
                <Avatar alt={AvatarImage} src={AvatarImage} />
              ) : (
                AvatarImage
              )}
            </Stack>
          )}
          <Stack justifyContent="center">
            {title && (
              <Typography
                sx={{ lineHeight: 1.1, fontWeight: "600" }}
                variant="subtitle1"
              >
                {title}
              </Typography>
            )}
            {subTitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: "1",
                  fontWeight: "400",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  width: "270px",
                }}
              >
                {subTitle}
              </Typography>
            )}
          </Stack>
        </Stack>

        {rightIcon}
      </Stack>
    </Box>
  );
});

export default ProfileCard;
