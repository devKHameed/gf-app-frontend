import { List, ListItem, Stack, SxProps, Typography } from "@mui/material";
import * as React from "react";
import { InfoCard } from "./AccountInfoCard.style";

interface InfoListType {
  title?: string;
  description?: string;
  headerRightIcon?: React.ReactElement | React.ReactNode;
  headerIcon?: React.ReactElement | React.ReactNode;
  data?: any[];
  sx?: SxProps;
  className?: string;
}
export const MapList = ({ data }: any) => (
  <List dense={true}>
    {data?.map((value: any) => (
      <ListItem>
        <Stack
          direction={"row"}
          alignItems="center"
          spacing={1.5}
          justifyContent={"space-between"}
          width="100%"
          sx={{
            marginBottom: value.rightIcon && 1.5,
            marginTop: value.rightIcon && 1,
          }}
        >
          <Stack direction={"row"} alignItems="center" spacing={1.5}>
            {value.icon && (
              <Typography variant="subtitle2">{value.icon}</Typography>
            )}
            {value.title && (
              <Typography
                variant="body2"
                component="div"
                sx={{ verticalAlign: "middle" }}
              >
                {value.title}
              </Typography>
            )}
          </Stack>
          {value.rightIcon && (
            <Typography variant="subtitle2" sx={{ marginLeft: "auto" }}>
              {value.rightIcon}
            </Typography>
          )}
        </Stack>
      </ListItem>
    ))}
  </List>
);

export default function InfoList(props: InfoListType) {
  const {
    title = "Jason Gatlin",
    description,
    headerRightIcon,
    headerIcon,
    data,
    className,
    sx,
  } = props;
  return (
    <InfoCard
      className={className}
      sx={{
        pb: 0.5,
        ...sx,
      }}
    >
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems={"center"}
        sx={{ padding: "16px 16px 0" }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={1.25}>
          {headerIcon}
          <Typography variant="subtitle1" component="div">
            {title}
          </Typography>
        </Stack>
        {headerRightIcon}
      </Stack>
      {description && (
        <Stack sx={{ padding: "16px 16px 0" }}>
          <Typography
            variant="body2"
            component="div"
            sx={{ whiteSpace: "pre" }}
          >
            {description}
          </Typography>
        </Stack>
      )}
      <MapList data={data} />
    </InfoCard>
  );
}
