import {
  DeleteOutline,
  EditOutlined,
  FlashOnRounded,
} from "@mui/icons-material";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { IconButton, styled, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import moment from "moment";
import { SyntheticEvent, useId } from "react";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
import timePassedSince from "utils/timePassedSince";
import Card from "./Card";
type Props<T> = {
  data?: T[];
  keyBinding?: {
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    tags?: string;
  };
  tagKeyBinding?: {
    label: string;
    color: string;
  };
  onEdit?: (item: T) => void;
  onDeleteClick?: (item: T) => void;
  onItemClick?: (item: T, e: SyntheticEvent<HTMLDivElement>) => void;
  type?: "default" | "card";
};
export type BaseListProps<T> = Props<T>;

export const RStack = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  gap: "24px",
  marginTop: "3px",

  [`${theme.breakpoints.down("sm")}`]: {
    flexDirection: "column",
    gap: "4px",
  },

  ".right-icon": {
    [`${theme.breakpoints.down("sm")}`]: {
      display: "none",
    },
  },
}));

export const RightIcons = styled(Stack)(({ theme }) => ({
  [`${theme.breakpoints.down("sm")}`]: {
    display: "none",
  },
}));

const Tags = ({ tags }: { tags: { title: string; color: string }[] }) => {
  const id = useId();
  return (
    <Box>
      {tags.map((tag, index) => (
        <Chip
          key={`${id}-${index}`}
          label={tag.title}
          sx={{
            borderRadius: "3px",
            height: "20px",
            color: tag.color || "text.primary",
          }}
        />
      ))}
    </Box>
  );
};
export const defaultBindingKey = {
  title: "title",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  tags: "tags",
  description: "description",
} as const;

const BaseList = <
  T extends { slug: string; [key: string]: any } = {
    slug: string;
    [key: string]: any;
  }
>(
  props: Props<T>
) => {
  const {
    data,
    tagKeyBinding,
    type = "default",
    keyBinding,
    onEdit,
    onItemClick,
    onDeleteClick,
  } = props;

  const id = useId();
  const binding = keyBinding || defaultBindingKey;
  const theme = useTheme();

  const handleEdit = (item: T) => {
    onEdit?.(item);
  };
  const handleItemClick = (item: T, e: SyntheticEvent<HTMLDivElement>) => {
    onItemClick?.(item, e);
  };
  return (
    <Stack gap={1.25}>
      {data?.map((item, index) => {
        return (
          <Box
            key={item.slug || `${id}-${index}`}
            onClick={(e) => handleItemClick(item, e)}
          >
            {type === "default" && (
              <ProfileCard
                // sx={{ marginBottom: 1.5 }}
                options={{ draggable: false, switcher: false }}
                title={item[binding.title]}
                subTitle={
                  <RStack>
                    <Box component={"span"}>
                      Created:{" "}
                      {moment(item[binding.createdAt]).format("MMM DD yyyy")}
                    </Box>
                    <Box component={"span"}>
                      Updated: {timePassedSince(item[binding.updatedAt])}
                    </Box>
                  </RStack>
                }
                AvatarImage={
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      background: theme.palette.warning.main,
                      borderRadius: "6px",
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                      mr: 0.75,
                    }}
                  >
                    <FlashOnRounded />
                  </Stack>
                }
                rightIcon={
                  <RightIcons direction="row" gap={0.75}>
                    <Tags
                      tags={item[binding.tags || defaultBindingKey.tags] || []}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick?.(item);
                      }}
                    >
                      <DeleteOutline
                        fontSize="small"
                        sx={{
                          color: "success.dark",
                          width: "16px",
                          height: "auto",
                        }}
                      />
                    </IconButton>
                    <SettingsOutlined
                      sx={{
                        color: "success.dark",
                        width: "16px",
                        height: "auto",
                      }}
                    />
                    <EditOutlined
                      onClick={() => handleEdit(item)}
                      sx={{
                        color: "success.dark",
                        width: "16px",
                        height: "auto",
                      }}
                    />
                  </RightIcons>
                }
              />
            )}
            {type === "card" && (
              <Card
                title={item[binding.title]}
                description={binding.description && item[binding.description]}
                createdAt={timePassedSince(item[binding.createdAt])}
                tags={binding.tags && item[binding.tags]}
                tagKeyBinding={tagKeyBinding}
              />
            )}
          </Box>
        );
      })}
    </Stack>
  );
};

export default BaseList;
