import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import MTabs, { TabsProps } from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import React from "react";
type Props = TabsProps;
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
const Tabs = (props: Props) => {
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
          <Tab icon={<PhoneIcon />} label="top" />
          <Tab icon={<PhoneMissedIcon />} iconPosition="start" label="start" />
          <Tab icon={<FavoriteIcon />} iconPosition="end" label="end" />
          <Tab icon={<PersonPinIcon />} iconPosition="bottom" label="bottom" />
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

export default Tabs;
