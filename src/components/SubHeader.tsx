import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Box, Stack, Typography, styled } from "@mui/material";
import React from "react";
import SearchInput from "./Inputs/SearchInput";

type Props = {
  icon?: React.ReactNode;
  title?: string;
  rightSide?: React.ReactNode;
  leftIcon?: boolean;
  leftExtras?: React.ReactElement | React.ReactNode;
};

const SubHeaderBlock = styled(Stack)(({ theme }) => ({
  padding: "15px 25px",
  background: theme.palette.common.blackshades?.["4p"],
  borderBottom: `1px solid ${theme.palette.background.GF10}`,

  ".icon": {
    width: "20px",

    svg: {
      width: "100%",
      height: "auto",
      display: "block",
    },
  },

  ".heading": {
    fontWeight: "500",
  },

  ".field-holder": {
    width: "280px",
    background: theme.palette.background.GF10,

    ".MuiInputBase-root": {
      width: "calc(100% - 36px)",
    },
  },
}));

const SubHeader: React.FC<Props> = (props) => {
  const {
    icon,
    leftIcon = true,
    title = "Fuison",
    rightSide,
    leftExtras,
  } = props;

  return (
    <SubHeaderBlock
      className="sub-header"
      justifyContent={"space-between"}
      alignItems={"center"}
      direction={"row"}
    >
      <Stack alignItems={"center"} direction={"row"} gap={"20px"}>
        {leftExtras && <>{leftExtras}</>}
        {leftIcon && (
          <>
            {icon ? (
              <Box className="icon">{icon}</Box>
            ) : (
              <Box className="icon">
                <SettingsOutlinedIcon />
              </Box>
            )}
          </>
        )}
        {title && <Typography className="heading">{title}</Typography>}
      </Stack>
      <Box className="field-holder">
        {rightSide ? rightSide : <SearchInput />}
      </Box>
    </SubHeaderBlock>
  );
};

export default SubHeader;
