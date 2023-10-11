import { Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import GenericIcon from "components/util-components/Icon";
import React from "react";
import { RcPostStack } from "./DividerItems.style";
interface Props {
  fileSize?: string;
  title?: string;
  icon?: string;
}

const DividerItem: React.FC<Props> = (props) => {
  const theme = useTheme();
  const { fileSize, title = "Select Icon", icon } = props;
  return (
    <RcPostStack
      direction="row"
      alignItems={"center"}
      justifyContent="space-between"
      px={2}
      py={1.375}
      borderRadius="6px"
      sx={{
        background: theme.palette.background.GF7,
        "&:hover": {
          background: theme.palette.background.GF10,
        },
      }}
    >
      <Stack direction="row" alignItems={"center"}>
        <GenericIcon iconName={icon || "Menu"} key={icon || "Menu"} />
        <Divider orientation="vertical" flexItem sx={{ mx: 1.5 }} />
        <Stack direction="column">
          <Typography component="div" variant="subtitle2">
            {title}
          </Typography>
          {fileSize && (
            <Typography component="div" variant="caption" fontWeight={400}>
              {fileSize}
            </Typography>
          )}
        </Stack>
      </Stack>
      {/* <CloseOutlinedIcon /> */}
    </RcPostStack>
  );
};

export default DividerItem;
