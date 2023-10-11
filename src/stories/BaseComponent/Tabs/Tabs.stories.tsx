import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import MTabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import * as React from "react";
import Tabs from "./Tabs";

export default {
  title: "Components/Tabs",
  component: Tabs,
} as ComponentMeta<typeof Tabs>;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export const BasicTabs: ComponentStory<typeof Tabs> = (props) => {
  return <Tabs {...props} />;
};
export const TabsWithoutIcons: ComponentStory<typeof MTabs> = (props) => {
  const { value: tabValue, onChange: OnTabChange, ...rest } = props;
  const [value, setValue] = React.useState(tabValue || 0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    OnTabChange?.(event, newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <MTabs
          value={value}
          onChange={handleChange}
          aria-label="icon position tabs example"
          {...rest}
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </MTabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
};
