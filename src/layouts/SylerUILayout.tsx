import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import MarkChatReadOutlinedIcon from "@mui/icons-material/MarkChatReadOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import WebhookOutlinedIcon from "@mui/icons-material/WebhookOutlined";

import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  styled,
} from "@mui/material";
import {
  BagCheckIcon,
  BagLinesIcon,
  DashboardViewAllIcon,
  ScheduleAutomationsIcon,
  ScheduleAutomationsViewAllIcon,
  SkillActive,
  SkillCreate,
  SkillStore,
  TableAddIcon,
  TableIcon,
  ViewAllEyeIcon,
  ViewAllStarIcon,
} from "assets/icons";
import SubNavMenu from "components/SubNavmenu";
import React, { useEffect } from "react";
import { useSystemLayoutStore } from "store/stores/systemLayout";
type Props = {
  children?: React.ReactElement;
  rightMenu?: boolean;
};
const MenuWrap = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  margin: "0 -14px 0 0",

  ".MuiDivider-root ": {
    borderColor: theme.palette.background.GF20,
  },
}));

const MenuIconsList = styled(List)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "0 0 0 15px",
  fontSize: "14px",
  lineHeight: "24px",
  fontWeight: "600",

  li: {
    padding: "0",
    width: "auto",
    margin: "0 4px",
  },

  ".MuiListItemButton-root,.MuiListItemIcon-root": {
    margin: "0",
    minWidth: "30px",
    minHeight: "30px",
    padding: "3px",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.text.primary,
    cursor: "pointer",
    borderRadius: "4px",
    textAlign: "center",

    ".button-text": {
      padding: "0 6px",
    },

    "&:hover": {
      background: theme.palette.background.GF10,
    },
  },

  ".MuiListItemButton-root": {
    background: theme.palette.background.GF10,
  },
}));
const navItems = [
  {
    path: "chat",
    title: "Chat",
    children: [
      {
        path: "chat/active-chat",
        title: "Active Chat",

        Icon: <MarkChatReadOutlinedIcon />,
      },
      {
        path: "chat/chat-history",
        title: "Chat history",

        Icon: <ChatOutlinedIcon />,
      },
      {
        path: "chat/active-jobs",
        title: "Active jobs",

        Icon: <BagCheckIcon />,
      },
      {
        path: "chat/job-history",
        title: "Job history",

        Icon: <BagLinesIcon />,
      },
    ],
  },

  {
    path: "dashboards",
    title: "Dashboards",
    children: [
      {
        path: "dashboard/new-dashboard",
        title: "New dashboard",

        Icon: <DashboardCustomizeOutlinedIcon />,
      },
      {
        path: "dashboard/view-all",
        title: "View all",

        Icon: <DashboardViewAllIcon />,
      },
      {
        path: "dashboard/list-of-favorites",
        title: "Favorites",

        Icon: <StarBorderPurple500OutlinedIcon />,
      },
    ],
  },
  {
    path: "media",
    title: "Media",
    children: [
      {
        path: "media/photos",
        title: "Photos",

        Icon: <InsertPhotoOutlinedIcon />,
      },
      {
        path: "media/videos",
        title: "Videos",

        Icon: <SlideshowOutlinedIcon />,
      },
      {
        path: "media/audio",
        title: "Audio",

        Icon: <VolumeUpOutlinedIcon />,
      },
      {
        path: "media/presentations",
        title: "Presentations",

        Icon: <BrokenImageOutlinedIcon />,
      },
    ],
  },
  {
    path: "data",
    title: "Data",
    children: [
      {
        path: "data/my-tables",
        title: "My Tables",

        Icon: <TableIcon />,
      },
      {
        path: "data/new-table",
        title: "New Table",

        Icon: <TableAddIcon />,
      },
    ],
  },
  {
    path: "workflows",
    title: "Workflows",
    children: [
      {
        path: "workflows/scheduled-animations",
        title: "Scheduled automations",

        Icon: <ScheduleAutomationsIcon />,
        children: [
          {
            path: "workflows/scheduled-animations/view-all",
            title: "View All",

            Icon: <ScheduleAutomationsViewAllIcon />,
          },
          {
            path: "workflows/scheduled-animations/new-workflow",
            title: "Add New",

            Icon: <AddCardOutlinedIcon />,
          },
        ],
      },
      {
        path: "workflows/webhooks",
        title: "Webhook (API)",

        Icon: <WebhookOutlinedIcon />,
        children: [
          {
            path: "workflows/webhooks/view-all",
            title: "View All",

            Icon: <EastOutlinedIcon />,
          },
          {
            path: "workflows/webhooks/new-webhook",
            title: "Add New",

            Icon: <AddOutlinedIcon />,
          },
        ],
      },
      {
        path: "workflows/import-templates",
        title: "Import templates",

        Icon: <UploadFileOutlinedIcon />,
        children: [
          {
            path: "workflows/import-templates/view-all",
            title: "View All",

            Icon: <ScheduleAutomationsViewAllIcon />,
          },
          {
            path: "workflows/import-templates/new-webhook",
            title: "Add New",

            Icon: <AddCardOutlinedIcon />,
          },
        ],
      },
      {
        path: "workflows/view_all",
        title: "View all",

        Icon: <ViewAllStarIcon />,
        children: [
          {
            path: "workflows/view-all/view",
            title: "View All",

            Icon: <ViewAllEyeIcon />,
          },
          {
            path: "workflows/view-all/new-view",
            title: "Add New",

            Icon: <AddOutlinedIcon />,
          },
        ],
      },
    ],
  },
  {
    path: "skills",
    title: "Skills",
    children: [
      {
        path: "skills/active-skills",
        title: "Active Skills",

        Icon: <SkillActive />,
      },
      {
        path: "skills/skill-store",
        title: "Skill Store",

        Icon: <SkillStore />,
      },
      {
        path: "skills/skill-builder",
        title: "Skill Builder",

        Icon: <SkillCreate />,
      },
    ],
  },
  {
    path: "settings",
    title: "Settings",
    children: [
      {
        path: "settings/users",
        title: "Users",

        Icon: <PersonOutlineOutlinedIcon />,
      },
      {
        path: "settings/user-groups",
        title: "User Groups",

        Icon: <PeopleOutlinedIcon />,
      },
    ],
  },
];
const ListingNavBar = ({ rightMenu = true }: { rightMenu?: boolean }) => {
  return (
    <MenuWrap>
      {/* <MenuList>
        {navItems.map((ele, index) => {
          return (
            <ListItem key={`${ele}-${index}`}>
              <NavLink to={`${ele.path}`}>{ele.title}</NavLink>
            </ListItem>
          );
        })}
      </MenuList> */}
      <SubNavMenu routes={navItems} />
      {rightMenu && (
        <>
          <Divider orientation="vertical" />
          <MenuIconsList>
            <ListItem>
              <ListItemIcon>
                <RestoreOutlinedIcon sx={{ width: "18px", height: "auto" }} />
              </ListItemIcon>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MessageOutlinedIcon sx={{ width: "20px", height: "auto" }} />
              </ListItemIcon>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <Box className="button-text">Slideshow</Box>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <RemoveRedEyeOutlinedIcon
                  sx={{ width: "18px", height: "auto" }}
                />
              </ListItemButton>
            </ListItem>
          </MenuIconsList>
        </>
      )}
    </MenuWrap>
  );
};
const SylerUILayout = ({ children, rightMenu = true }: Props) => {
  const setAppBarProps = useSystemLayoutStore.useSetAppBarProps();
  useEffect(() => {
    setAppBarProps({
      DropDown: <ListingNavBar rightMenu={rightMenu} />,
      leftMenuClasses: "menu-left",
      className: "syler-ui",
      leftIcon: <></>,
      title: "sylar.ai",
      color: "primary",
    });

    return () => {
      setAppBarProps({});
    };
  }, []);
  return <React.Fragment>{children}</React.Fragment>;
};

export default SylerUILayout;
