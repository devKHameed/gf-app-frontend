import { Avatar, Badge, Box, Chip, Stack, Typography } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import React from "react";
import { RcPostCard } from "./PostCard.style";
interface Props {
  createdAt?: string;
  description?: string;
  imgUrl?: string;
  tags?: { [key: string]: string }[];
  title?: string[];
  tagKeyBinding?: {
    label: string;
    color: string;
  };
}
export const defaultTagBindingKey = {
  label: "label",
  color: "color",
} as const;
const InfomationCard: React.FC<Props> = (props) => {
  const {
    title,
    tags,
    imgUrl = "/static/images/avatar/1.jpg",
    createdAt,
    description,
    tagKeyBinding = defaultTagBindingKey,
  } = props;
  return (
    <RcPostCard>
      <Box borderRadius="5px" mb={1.25}>
        <CardContent sx={{ px: 2.5 }}>
          <Typography
            gutterBottom
            variant="subtitle1"
            component="div"
            color={"text.primary"}
            mb="1.5"
          >
            {title}
          </Typography>
          {tags && (
            <Stack direction="row" spacing={1.25} mb={2}>
              {tags.map((tag) => (
                <Chip
                  label={tag[tagKeyBinding.label || defaultTagBindingKey.label]}
                  size="small"
                  sx={{
                    color:
                      tag[tagKeyBinding.color || defaultTagBindingKey.color],
                  }}
                />
              ))}
            </Stack>
          )}
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions sx={{ px: 2.5, pb: 1.5 }}>
          <Stack direction="row" spacing={1.5} alignItems={"center"}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar
                sx={{ width: "24px", height: "24px", fontSize: "12px" }}
                alt="Remy Sharp"
                src={imgUrl}
              />
            </Badge>
            <Box sx={{ lineHeight: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                component={"span"}
              >
                Created:
              </Typography>{" "}
              <Typography variant="caption" component={"span"}>
                {createdAt}
              </Typography>
            </Box>
          </Stack>
        </CardActions>
      </Box>
    </RcPostCard>
  );
};

export default InfomationCard;
