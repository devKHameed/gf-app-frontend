import { Box, Stack, Typography, styled } from "@mui/material";
import IOSSwitch from "components/IOSSwitch";
import React from "react";

type Props = {
  icon?: React.ReactNode;
  title?: string;
  discription?: string;
};

const SkillsCard = styled(Box)(({ theme }) => ({
  padding: "18px",
  background: theme.palette.background.cardsBG,
  border: `2px solid ${theme.palette.background.cardsBorder}`,
  borderRadius: "5px",

  ".card-head": {
    margin: "0 0 24px",
  },

  ".head-icon": {
    width: "64px",

    "svg, img": {
      width: "100%",
      height: "auto",
      display: "block",
    },
  },

  ".MuiSwitch-root": {
    ".Mui-checked": {
      ".MuiSwitch-thumb": {
        background: theme.palette.text.primary,
      },

      "+ .MuiSwitch-track": {
        background: theme.palette.background.cardsBorder,
      },
    },

    ".MuiSwitch-track": {
      background: theme.palette.background.cardsBG,
    },

    ".MuiSwitch-thumb": {
      background: theme.palette.background.GF40,
    },
  },

  ".heading": {
    display: "block",
    fontWeight: "600",
    lineHeight: "20px",
    margin: "0 0 10px",
  },

  ".description ": {
    fontSize: "14px",
    lineHeight: "22px",
    color: theme.palette.text.secondary,
  },
}));

const SkillsBadge: React.FC<Props> = (props) => {
  const {
    title = "Radiant Monkey Vision",
    discription = "Digital effect routing for skill monkey get paid lamer face titty milk.",
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        <rect width="40" height="40" rx="5" fill="#0061FF" />
        <path
          d="M20 13.75L14 17.5L20 21.25L14 25L8 21.25L14 17.5L8 13.75L14 10L20 13.75ZM13.9841 26.25L19.9841 22.5L25.9841 26.25L19.9841 30L13.9841 26.25ZM20 21.25L26 17.5L20 13.75L26 10L32 13.75L26 17.5L32 21.25L26 25L20 21.25Z"
          fill="white"
        />
      </svg>
    ),
    ...rest
  } = props;

  return (
    <SkillsCard>
      <Stack
        className="card-head"
        justifyContent="space-between"
        alignItems="top"
        direction={"row"}
        onClick={(e) => e.preventDefault()}
      >
        <Box className="head-icon">{icon}</Box>
        <IOSSwitch />
      </Stack>
      <Box>
        <Typography className="heading">{title}</Typography>
        <Typography className="description">{discription}</Typography>
      </Box>
    </SkillsCard>
  );
};

export default SkillsBadge;
