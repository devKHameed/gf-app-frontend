import CloseIcon from "@mui/icons-material/Close";
import {
  alpha,
  Box,
  Drawer,
  DrawerProps,
  Paper,
  PaperProps,
  Stack,
  styled,
  Tab,
  TabProps,
  Tabs,
  TabsProps,
  Typography,
} from "@mui/material";
import { ReactElement, ReactNode, useState } from "react";
type Props = {
  width?: string | number;
  paperProps?: PaperProps;
  icon?: ReactElement | ReactNode;
  title?: ReactElement | ReactNode | string;
  renderTabContent?: (_: { active?: string | number }) => ReactElement;
  tabsProps?: TabsProps;
  value?: string | number;
  onChange?: (value: any, event: React.SyntheticEvent) => void;
  tablist?: TabProps[];
  defaultTabKey?: string | number;
} & DrawerProps;

const Header = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.Setting,
  minHeight: "60px",
  padding: "0 20px 0 0",
}));
const Title = styled(Typography)(({ theme }) => ({
  padding: "5px 14px",
}));
const DrawerWrapper = styled(Drawer)(({ theme }) => ({
  ".MuiDrawer-paper": {
    background: `${theme.palette.background.GFRightNavBackground} !important`,
    ".MuiPaper-root": {
      background: `${theme.palette.background.GFRightNavBackground} !important`,
    },
  },
}));
const IconHolder = styled(Box)(({ theme }) => ({
  width: "20px",
  height: "20px",
  lineHeight: "1",
  cursor: "pointer",
  transition: "all 0.4s ease",
  color: theme.palette.text.primary,

  "&:hover": {
    color: theme.palette.background.GF60,
  },

  svg: {
    width: "100%",
    height: "auto",
    display: "block",
  },
}));
const LeftIconHolder = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "60px",
  height: "60px",
  background: theme.palette.background.GF7,
}));
const StyledTab = styled(Tabs)(({ theme }) => ({
  minHeight: "36px",

  ".MuiTab-root": {
    flex: "1",
    padding: "5px",
    minHeight: "36px",
    borderLeft: `1px solid ${theme.palette.background.GFTopNav}`,
    color: theme.palette.background.GF80,
    background: theme.palette.background.GF10,
    borderRadius: "0",
    maxWidth: "inherit",

    "&:first-child": {
      border: "none",
    },

    "&.Mui-selected": {
      color: theme.palette.common.white,
      background: theme.palette.background.GFRightNavBackground,
    },

    "&:not(.Mui-selected):hover": {
      background: alpha(theme.palette.common.white, 0.15),
    },

    svg: {
      width: "20px",
      height: "20px",
    },
  },

  ".MuiTabs-indicator ": {
    display: "none",
  },
}));

const GfDrawer: React.FC<React.PropsWithChildren<Props>> = ({
  width,
  children,
  paperProps,
  title,
  icon,
  renderTabContent,
  tabsProps,
  tablist = [],
  value,
  onChange,
  defaultTabKey,
  onClose,
  ...rest
}) => {
  const [activeTab, setActiveTab] = useState(value || defaultTabKey);
  const handleChange = (event: React.SyntheticEvent, value: any) => {
    setActiveTab(value);
    onChange?.(value, event);
  };
  const handleClose = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    onClose?.(event, reason);
  };
  return (
    <DrawerWrapper anchor={"right"} {...rest} onClose={handleClose}>
      <Paper {...paperProps} sx={{ width: width, ...(paperProps?.sx || {}) }}>
        <Header
          className="drawer-head"
          justifyContent="space-between"
          direction="row"
          alignItems="center"
        >
          <Stack
            alignItems="center"
            direction="row"
            className="drawer-title-box"
          >
            <LeftIconHolder className="drawer-icon-holder">
              {icon}
            </LeftIconHolder>
            <Title variant="subtitle1" className="drawer-title-holder">
              {title}
            </Title>
          </Stack>
          <IconHolder
            onClick={(e) => handleClose(e, "backdropClick")}
            className="drawer-clos-icon"
          >
            <CloseIcon />
          </IconHolder>
        </Header>
        {tablist?.length > 0 && (
          <StyledTab
            value={activeTab}
            onChange={handleChange as any}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            {...tabsProps}
          >
            {tablist?.map((tab, index) => {
              return <Tab {...tab} key={tab.key || index} disableRipple />;
            })}
          </StyledTab>
        )}
        {renderTabContent ? renderTabContent({ active: activeTab }) : children}
      </Paper>
    </DrawerWrapper>
  );
};

export default GfDrawer;
