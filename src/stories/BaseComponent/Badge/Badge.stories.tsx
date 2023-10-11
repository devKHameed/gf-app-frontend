import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
export default {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    children: { type: "string", defaultValue: "Badge" },
    badgeContent: {
      type: "number",
      defaultValue: 34,
    },
    color: {
      category: "color",
      defaultValue: "primary",
    },
  },
} as ComponentMeta<typeof Badge>;

export const Default: ComponentStory<typeof Badge> = (props) => (
  <Badge {...props} />
);
Default.argTypes = {
  children: {
    type: "string",
    defaultValue: "",
  },
};
export const BadgeComponent: ComponentStory<typeof Badge> = (props) => (
  <Badge {...props}>
    <NotificationsIcon />
  </Badge>
);
BadgeComponent.argTypes = {
  badgeContent: {
    type: "number",
    defaultValue: 34,
  },
};
export const BadgeDot: ComponentStory<typeof Badge> = (props) => (
  <Badge {...props}>
    <NotificationsIcon />
  </Badge>
);
BadgeDot.argTypes = {
  variant: {
    category: "variant",
    defaultValue: "dot",
  },
};
