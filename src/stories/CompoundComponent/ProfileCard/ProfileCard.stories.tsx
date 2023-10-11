import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Chip, Stack, styled, Switch, SwitchProps } from "@mui/material";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import ProfileCard from "./ProfileCard";
export default {
  title: "CompoundComponent/ProfileCard",
  component: ProfileCard,
} as ComponentMeta<typeof ProfileCard>;

export const DraggableComponent: ComponentStory<typeof ProfileCard> = (
  props
) => {
  return (
    <ProfileCard
      options={{ draggable: true, switcher: false }}
      title="Project Manager"
      subTitle="zach@globalist.com"
      AvatarImage="/static/images/avatar/1.jpg"
      rightIcon={<SettingsOutlinedIcon sx={{ color: "success.dark" }} />}
    />
  );
};

export const SimpleCard: ComponentStory<typeof ProfileCard> = (props) => {
  return (
    <ProfileCard
      options={{ draggable: true, switcher: false }}
      title="Project Manager"
      subTitle="zach@globalist.com"
      AvatarImage={<LocalOfferOutlinedIcon />}
    />
  );
};

export const AuthItem: ComponentStory<typeof ProfileCard> = (props) => {
  return (
    <ProfileCard
      options={{ draggable: false, switcher: false }}
      title="Dropbox"
      subTitle="0 auth1 or Oauth2"
      AvatarImage={
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
      }
      rightIcon={
        <Stack direction={"row"} spacing={2} alignItems="center">
          <Chip label="primary" color="warning" />
          <IOSSwitch sx={{ m: 1 }} defaultChecked />
          <DeleteOutlinedIcon />
        </Stack>
      }
    />
  );
};
export const ProgressItem: ComponentStory<typeof ProfileCard> = (props) => {
  return <></>;
};
export const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
