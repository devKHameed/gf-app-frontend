import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Box, CardContent, Chip, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { RcStackCard } from "./UserDetailCard.style";

interface tagsStatus {
  label?: string;
  status?:
    | "primary"
    | "success"
    | "default"
    | "secondary"
    | "error"
    | "info"
    | "warning"
    | undefined;
}
interface Props {
  headerTitle?: string;
  imgUrl?: string;
  tags?: tagsStatus[];
  title?: string;
  username?: string;
  description?: string;
}
interface HeaderRowType {
  leftIcon?: React.ReactElement | React.ReactNode;
  title?: string;
  rightIcon?: React.ReactElement | React.ReactNode;
}
const UserDetailCard: React.FC<Props> = (props) => {
  const {
    headerTitle = "Designer Team",
    tags = [
      {
        label: "Admin",
        status: "primary",
      },
      {
        label: "Coder",
        status: "success",
      },
    ],
    title = "Gui Fusion CEO",
    username = "Zachary Bubeck",
    imgUrl = "",
    description = "Creates the very good things",
  } = props;
  return (
    <>
      <RcStackCard>
        <CardContent>
          <GetHeaderRow
            leftIcon={
              <ForumOutlinedIcon
                sx={{ width: "40px", height: "40px", color: "text.secondary" }}
              />
            }
            rightIcon={
              <ModeEditOutlineOutlinedIcon
                sx={{ color: "text.secondary", ml: 3 }}
              />
            }
            title={headerTitle}
          />

          <GetRow
            title={"description: "}
            content={
              <Typography variant="body1" color="text.secondary">
                {description}
              </Typography>
            }
          />
        </CardContent>
        <CardContent>
          <GetHeaderRow
            leftIcon={<Avatar src={imgUrl}>H</Avatar>}
            rightIcon={
              <ModeEditOutlineOutlinedIcon
                sx={{ color: "text.secondary", ml: 3 }}
              />
            }
            title={username}
          />
          <Stack direction="row" spacing={2} alignItems={"center"}>
            <Typography variant="body1" color="text.secondary">
              Title:{" "}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {title}
            </Typography>
            <GetRow
              title={"Tags: "}
              content={tags.map((ele) => (
                <Chip label={ele.label} color={ele.status} size="small" />
              ))}
            />
          </Stack>
        </CardContent>
      </RcStackCard>
    </>
  );
};
const GetHeaderRow = ({ leftIcon, title, rightIcon }: HeaderRowType) => {
  return (
    <Stack direction="row" alignItems={"center"} mb={1.75}>
      <Box
        width={"40px"}
        height={"40px"}
        display="flex"
        alignItems={"center"}
        mr={2}
      >
        {leftIcon}
      </Box>
      <Typography gutterBottom variant="h4" component="div" mb={0}>
        {title}
      </Typography>
      {rightIcon}
    </Stack>
  );
};
const GetRow = ({ title, content }: { title?: string; content?: any }) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="body1" color="text.secondary">
        {title}
      </Typography>
      <Stack direction="row" spacing={1.25} alignItems={"center"}>
        {content}
      </Stack>
    </Stack>
  );
};
export default UserDetailCard;
