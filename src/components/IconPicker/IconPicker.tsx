import {
  Avatar,
  Box,
  Button,
  Card,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import groupBy from "lodash/groupBy";
import React, { useEffect, useMemo, useState } from "react";
import { Components, Virtuoso } from "react-virtuoso";
import SearchField from "./SearchField";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GenericIcon from "components/util-components/Icon";
import { Icons } from "constants/index";
import Scrollbars from "react-custom-scrollbars-2";

type Props = {
  icons?: Icon[];
  groupKey?: keyof Icon;
  value?: string;
  onSelectIcon?: (iconSlug: string) => void;
};

const COLUMN_COUNT = 12;

type ScrollItemType =
  | { type: "icon-row"; data: Icon[] }
  | { type: "group"; data: string };

const IconContainer = styled(Box)(({ theme }) => ({
  marginLeft: "3px",
  marginRight: "3px",
  marginBottom: "6px",
  width: "30px",
  height: "30px",
  border: "1px solid transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  color: theme.palette.background.GF60,
  transition: "all 0.4s ease",
  "&:hover": {
    borderColor: "#fff",
    color: "text.primary",
  },
  "&.selected": {
    borderColor: "#fff",
    color: "text.primary",
  },
}));

const CustomIconAvatar = styled(Avatar)({
  background: "transparent",
  width: "30px",
  height: "30px",
});

const CustomIconBox = styled(Box)({
  width: "30px",
  height: "30px",
  "> svg": {
    maxWidth: "100%",
    maxHeight: "100%",
  },
});

const IconPickerContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.GFRightNavBackground,
  border: `1px solid ${theme.palette.background.GF40}`,
  borderRadius: "6px",
  marginBottom: "18px",
}));

const ExpandIconContainer = styled(Box)(({ theme }) => ({
  width: 14,
  display: "flex",
  alignItems: "center",
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  color: theme.palette.background.GF50,
  "& >svg": { width: "100%" },
}));

const Scroller: Components["Scroller"] = React.forwardRef(
  ({ children, style, ...props }, ref: any) => {
    const theme = useTheme();

    return (
      <Scrollbars
        autoHeight
        autoHeightMax={266}
        ref={(el: any) => {
          if (el?.view) {
            ref.current = el.view;
          }
        }}
        renderView={({ style: viewStyle }) => (
          <div
            {...props}
            style={{
              ...viewStyle,
              ...style,
              overflowX: "hidden",
              marginBottom: 0,
            }}
          ></div>
        )}
        renderThumbVertical={({ style: thumbStyle }) => (
          <div
            style={{
              ...thumbStyle,
              backgroundColor: theme.palette.background.GF40,
              borderRadius: "inherit",
            }}
          ></div>
        )}
        renderThumbHorizontal={({ style: thumbStyle }) => (
          <div
            style={{
              ...thumbStyle,
              display: "none",
            }}
          ></div>
        )}
      >
        {children}
      </Scrollbars>
    );
  }
);

const IconPickerComponentReactVirtuoso: React.FC<Props> = (props) => {
  const { icons, value, groupKey = "category_name", onSelectIcon } = props;

  const theme = useTheme();

  const [selected, setSelected] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  const { groupedIcons } = useMemo(() => {
    return {
      groupedIcons: groupBy(icons, groupKey),
    };
  }, [icons, groupKey]);

  useEffect(() => {
    setExpanded(new Set(Object.keys(groupedIcons)));
  }, [groupedIcons]);

  const scrollItems = useMemo(() => {
    return Object.entries(groupedIcons).reduce<ScrollItemType[]>(
      (acc, [key, value]) => {
        acc.push({ type: "group", data: key });
        if (!expanded.has(key)) {
          return acc;
        }

        const iconMap = new Map<number, Icon[]>();
        value.forEach((v, idx) => {
          const row = Math.floor(idx / COLUMN_COUNT);
          const mapValues = iconMap.get(row);
          if (!mapValues) {
            iconMap.set(row, [v]);
          } else {
            mapValues.push(v);
          }
        });
        iconMap.forEach((values, row) => {
          acc.push({ type: "icon-row", data: values });
        });
        return acc;
      },
      []
    );
  }, [groupedIcons, expanded]);

  return (
    <>
      <IconPickerContainer>
        <Virtuoso
          style={{ height: "266px" }}
          totalCount={scrollItems.length}
          components={{ Scroller }}
          // fixedItemHeight={36}
          // overscan={10}
          itemContent={(index) => {
            const scrollItem = scrollItems[index];
            if (scrollItem.type === "group") {
              return (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ mx: 1.5, height: 36 }}
                  onClick={() =>
                    setExpanded((prev) => {
                      if (prev.has(scrollItem.data)) {
                        prev.delete(scrollItem.data);
                      } else {
                        prev.add(scrollItem.data);
                      }

                      return new Set(prev);
                    })
                  }
                >
                  <Typography
                    variant="subtitle2"
                    color={theme.palette.background.GF80}
                  >
                    {scrollItem.data}
                  </Typography>
                  <ExpandIconContainer component="span">
                    {expanded.has(scrollItem.data) ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ExpandIconContainer>
                </Stack>
              );
            }

            return (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ ml: 0.5, height: 36 }}
              >
                {scrollItem.data?.map((icon) => (
                  <Tooltip title={icon.title} placement="top" arrow>
                    <IconContainer
                      className={selected === icon.slug ? "selected" : ""}
                      onClick={() => setSelected(icon.slug)}
                      key={icon.slug}
                    >
                      {icon.native_ref ? (
                        <GenericIcon iconName={icon.native_ref as Icons} />
                      ) : (
                        // <Typography>{icon.title.slice(0, 1)}</Typography>
                        <CustomIconAvatar src={icon.svg} variant="square">
                          <CustomIconBox
                            component="div"
                            dangerouslySetInnerHTML={{ __html: icon.svg }}
                          ></CustomIconBox>
                        </CustomIconAvatar>
                      )}
                    </IconContainer>
                  </Tooltip>
                ))}
              </Stack>
            );
          }}
        />
      </IconPickerContainer>
      <Button
        variant="contained"
        sx={{ width: "100%" }}
        onClick={() => {
          if (selected) {
            onSelectIcon?.(selected);
          }
        }}
      >
        Set icon
      </Button>
    </>
  );
};

const IconPicker: React.FC<Props> = (props) => {
  const { icons, ...rest } = props;

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (search) {
      return (
        icons?.filter(
          (icon) =>
            icon.title
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()) ||
            icon.tags.some((t) =>
              t.toLocaleLowerCase().includes(search.toLocaleLowerCase())
            )
        ) || []
      );
    }

    return icons || [];
  }, [icons, search]);

  return (
    <Card sx={{ padding: 2 }}>
      <SearchField
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        onClear={() => setSearch("")}
      />
      <IconPickerComponentReactVirtuoso icons={filtered} {...rest} />
      {/* <IconPickerComponentReactVirtualized icons={filtered} {...rest} /> */}
    </Card>
  );
};

export default IconPicker;
