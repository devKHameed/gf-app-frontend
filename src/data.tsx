import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import EastIcon from "@mui/icons-material/East";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import TollOutlinedIcon from "@mui/icons-material/TollOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import { Avatar, Chip } from "@mui/material";

export const listData = [
  {
    title: "Assc Organizations",
    subtitle: "",
    leftIcon: <></>,
    rightIcon: <AddBoxTwoToneIcon />,
  },
  {
    title: "Inner Trode Optics",
    subtitle: "Code Monkey",
    rightIcon: <AddBoxTwoToneIcon />,
    leftIcon: <></>,
  },
  {
    title: "Inner Trode Optics",
    subtitle: "Code Monkey",
    rightIcon: <CloseTwoToneIcon />,
    leftIcon: <></>,
  },
  {
    title: "Assc Organizations",
    subtitle: "",
    rightIcon: <EastIcon />,
    leftIcon: <></>,
  },
  {
    title: "Assc Organizations",
    subtitle: "",
    leftIcon: <PlaylistAddOutlinedIcon />,
  },
];
export const trailingData = [
  {
    title: "Role Based Access",
    subtitle: "",
    rightIcon: <AddBoxTwoToneIcon />,
    leftIcon: <PlaylistAddOutlinedIcon />,
  },
  {
    title: "Role Based Access",
    subtitle: "Code Monkey",
    leftIcon: <PlaylistAddOutlinedIcon />,
    rightIcon: <></>,
  },
  {
    title: "Role Based Access",
    subtitle: "",
    rightIcon: <EastIcon />,
    leftIcon: <></>,
  },
  {
    title: "Role Based Access",
    subtitle: "",
    rightIcon: <></>,
    leftIcon: <></>,
  },
];
export const statusdata = [
  {
    runTime: "4:45 AM",
    runTimeNo: "Run Test #1",
    runStatus: "Errors",
  },
  {
    runTime: "4:45 AM",
    runTimeNo: "Run Test #2",
    runStatus: "Completed",
  },
  {
    runTime: "4:45 AM",
    runTimeNo: "Run Test #3",
    runStatus: "Pending",
  },
];
export const dataStack = [
  {
    runingModule: ["N", "N", "N", "N", "N"],
    max: 4,
    title: "On create",
  },
  {
    runingModule: ["N", "N", "N", "N", "N"],
    max: 2,
    title: "On create",
  },
  {
    runingModule: ["N", "N", "N", "N", "N"],
    max: 1,
    title: "On create",
  },
  {
    runingModule: ["N", "N", "N", "N", "N"],
    max: 2,
    title: "On create",
  },
];
export const dataStackTwo = [
  {
    runingModule: ["N", "N", "N", "N", "N"],
    max: 4,
    title: "On create",
  },
  {
    runingModule: ["N", "N", "N", "N", "N"],
    max: 2,
    title: "On create",
  },
];
export const accountinfoDataTwo = [
  {
    title: (
      <Chip
        color="warning"
        sx={{
          width: "54px",
          height: "28px",
          border: "1px solid",
          borderColor: "text.primary",
          borderRadius: "5px",
        }}
      />
    ),
    icon: "Theme Color: ",
  },
  {
    title: "English",
    icon: "Language: ",
  },
  {
    title: "Global",
    icon: "Audience: ",
  },
  {
    title: "1",
    icon: "Manifest Version: ",
  },
];

export const accountinfoDataTwo2 = [
  {
    title: (
      <Chip
        color="warning"
        sx={{
          width: "54px",
          height: "28px",
          border: "1px solid",
          borderColor: "text.primary",
          borderRadius: "5px",
        }}
      />
    ),
    icon: "Theme Color: ",
  },
  {
    title: "English",
    icon: "Language: ",
  },
  {
    title: "Global",
    icon: "Audience: ",
  },
  {
    title: "1",
    icon: "Manifest Version: ",
  },
];
export const accountinfoData = [
  {
    title: "4:20 PM local time",
    icon: <WatchLaterOutlinedIcon sx={{ color: "grey.500" }} />,
  },
  {
    title: "Yokohama, Kanagawa, Japan",
    icon: <LocationOnOutlinedIcon sx={{ color: "grey.500" }} />,
  },
  {
    title: "gat@gatlin.design",
    icon: <EmailOutlinedIcon sx={{ color: "grey.500" }} />,
  },
  {
    title: "805.485.1984",
    icon: <LocalPhoneOutlinedIcon sx={{ color: "grey.500" }} />,
  },
  {
    title: "Created:  Oct 10, 2022  Updated:  Dec 1, 2022",
    icon: <CalendarTodayOutlinedIcon sx={{ color: "grey.500" }} />,
  },
];
export const accountinfoData1 = [
  {
    title: "Designer Admin",
    icon: <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />,
    rightIcon: <DeleteIcon />,
  },
  {
    title: "Created:  Oct 10, 2022  Updated:  Dec 1, 2022",
    icon: <CalendarTodayOutlinedIcon sx={{ color: "grey.500" }} />,
  },
];
export const runningTestData = [
  {
    title: "4:20 PM local time",
    icon: <AccessTimeOutlinedIcon sx={{ color: "grey.500" }} />,
    value: "12:02:23",
  },
  {
    title: "Fuse credits used",
    icon: <TollOutlinedIcon sx={{ color: "grey.500" }} />,
    value: "06",
  },
  {
    title: "Last updated",
    icon: <CalendarTodayOutlinedIcon sx={{ color: "grey.500" }} />,
    value: "Oct 10, 2022 ",
  },
  {
    title: "Flow Errors",
    icon: <InfoOutlinedIcon sx={{ color: "grey.500" }} />,
    value: "02",
  },
];
