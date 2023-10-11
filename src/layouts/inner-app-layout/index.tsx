import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { Box, CardContent, Stack, styled, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import MTabs, { TabsProps } from "@mui/material/Tabs";
import React, { ReactElement, useEffect, useId, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Chip from "stories/BaseComponent/Chip/Chip";
type Props = {
  className?: string;
  icon?: ReactElement;
  title?: string | ReactElement;
  subtitle?: string | ReactElement;
  extra?: ReactElement;
  tabList?: (Partial<TabPanelProps> & React.ComponentProps<typeof Tab>)[];
  backIcon?: boolean;
  loading?: boolean;
  tags?: boolean;
  onBackClick?: () => void;
  paramName?: string;
} & Omit<TabsProps, "title">;

interface TabPanelProps {
  value: number;
  index: number;
  children?: React.ReactNode;
}
const BoxIcon = styled(Box)(({ theme }) => ({
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  marginRight: "16px",
  color: theme.palette.text.primary,

  [`${theme.breakpoints.down("sm")}`]: {
    width: "18px",
    height: "18px",
    marginRight: "10px",
  },

  svg: {
    color: theme.palette.text.primary,
    maxWidth: "100%",
    height: "auto",
  },
}));

const BoxTabs = styled(MTabs)(({ theme }) => ({
  minHeight: "30px",

  ".MuiTabScrollButton-root": {
    marginTop: "-4px",
  },

  ".MuiTab-root ": {
    padding: "0 0 6px",
    marginRight: "40px",
    minWidth: "inherit",
    minHeight: "27px",
    fontSize: "16px",
    lineHeight: "20px",

    [`${theme.breakpoints.down("sm")}`]: {
      padding: "8px 0",
    },

    "&:not(.Mui-selected):hover": {
      ".tab-text ": {
        color: theme.palette?.other?.standardInputLine,
      },
    },

    "&.Mui-selected ": {
      fontWeight: "600",

      ".tab-text ": {
        color: theme.palette.text.primary,
      },
    },

    ".MuiTypography-root ": {
      lineHeight: "20px",
    },

    ".tab-text ": {
      color: theme.palette.text.secondary,
      transition: "all 0.4s ease",
    },

    ".counter": {
      fontWeight: "600",
    },
  },

  ".MuiTabs-indicator": {
    height: "3px",
  },
}));

export const InnerBoxWrap = styled(Box)(({ theme }) => ({
  padding: "40px",

  [`${theme.breakpoints.down("sm")}`]: {
    padding: "11px 15px",
  },
}));

export const CardBox = styled(CardContent)(({ theme }) => ({
  marginBottom: "30px",
  padding: "0",
  flexBasis: 0,
  flexGrow: 1,

  [`${theme.breakpoints.down("sm")}`]: {
    margin: "-9px -15px 0",
    padding: "14px 15px 5px",
    background: theme.palette.common.blackshades["30p"],
    borderBottom: `1px solid ${theme.palette.background.GFOutlineNav}`,
  },

  ".heading-wrap": {
    width: "100%",
  },
}));

export const IconHolder = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "40px",
  marginRight: "16px",

  [`${theme.breakpoints.down("sm")}`]: {
    width: "20px",
    height: "20px",
    marginRight: "8px",

    svg: {
      width: "100%",
      height: "auto",
      display: "block",
    },
  },
}));

export const HeadingBox = styled(Typography)(({ theme }) => ({
  [`${theme.breakpoints.down("sm")}`]: {
    fontSize: "15px",
    lineHeight: "20px",
    fontWeight: "600",
  },
}));

export const Description = styled(Typography)(({ theme }) => ({
  [`${theme.breakpoints.down("sm")}`]: {
    display: "none",
  },
}));

export const CenterBox = styled(Box)(({ theme }) => ({
  paddingTop: "24px",
}));

export const ChipBox = styled(Chip)(({ theme }) => ({
  padding: "2px 10px",
  borderRadius: "3px",
  fontSize: "13px",
  lineHeight: "18px",
  fontWeight: "400",
  height: "22px",
  minWidth: "inherit",
  color: theme.palette.text.primary,

  ".MuiChip-label": {
    padding: "0",
  },
}));

export const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
}));
export const SectionHeader: React.FC<
  Pick<Props, "icon" | "title" | "subtitle" | "extra" | "tags">
> = ({ icon, title, subtitle, extra, tags = false }) => {
  return (
    <CardBox className="heading-card">
      <Stack
        direction="row"
        justifyContent="space-between"
        className="heading-wrap"
        mb={1}
      >
        <Stack
          direction="row"
          alignItems={"center"}
          className="heading-card-row"
        >
          {icon && <BoxIcon className="heading-icon">{icon}</BoxIcon>}
          <HeadingBox
            gutterBottom
            variant="h4"
            mb={0}
            className="heading-title"
          >
            {title}
          </HeadingBox>
        </Stack>
        {extra && <Box>{extra}</Box>}
      </Stack>
      <Description variant="body1" color="text.secondary" className="debugger">
        {subtitle}
      </Description>
      {tags && (
        <Stack direction="row" gap={1.25}>
          <ChipBox label="v1.0.0" color="warning" />
          <ChipBox label="Beta" color="success" />
          <ChipBox label="Private" color="error" />
        </Stack>
      )}
    </CardBox>
  );
};
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

const InnerPageLayout: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const id = useId();

  const {
    value: tabValue,
    onChange: OnTabChange,
    children,
    tabList,
    title,
    subtitle,
    icon,
    extra,
    backIcon,
    tags,
    onBackClick,
    paramName = "t",
    ...rest
  } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const tabIndex = Number(searchParams.get(paramName));

  const [value, setValue] = React.useState(
    tabValue || Number(searchParams.get(paramName)) || 0
  );
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  //Only consider tab event if it's different
  useEffect(() => {
    if (valueRef.current !== tabIndex) {
      setValue(tabIndex);
      OnTabChange?.({} as any, tabIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex]);
  // useEffect(() => {
  //   setValue(tabValue);
  // }, [tabValue]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    OnTabChange?.(event, newValue);
    setSearchParams({ [paramName]: newValue.toString() });
  };
  return (
    <InnerBoxWrap>
      <HeaderWrapper>
        <SectionHeader
          title={title}
          icon={
            backIcon ? (
              <ArrowCircleLeftOutlinedIcon onClick={onBackClick} />
            ) : (
              icon
            )
          }
          subtitle={subtitle}
          extra={extra}
          tags={tags}
        />
      </HeaderWrapper>
      <Box sx={{ width: "100%" }}>
        <Box>
          <BoxTabs
            value={value}
            onChange={handleChange}
            scrollButtons="auto"
            variant="scrollable"
            {...rest}
          >
            {tabList?.map((tbprops, idx) => {
              const { children, ...rest } = tbprops;
              return <Tab disableRipple key={`${id}-${idx}`} {...rest} />;
            })}
          </BoxTabs>
        </Box>
        <CenterBox>
          {children
            ? children
            : tabList?.map((tb, index) => {
                return (
                  <TabPanel
                    key={`${id}-${index}`}
                    value={value}
                    index={tb?.index || index}
                  >
                    {tb.children}
                  </TabPanel>
                );
              })}
        </CenterBox>
      </Box>
    </InnerBoxWrap>
  );
};
export default InnerPageLayout;
