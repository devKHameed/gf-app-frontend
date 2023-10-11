import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  ClickAwayListener,
  Stack,
  styled,
  Tooltip,
  TooltipProps,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchInput from "components/Inputs/SearchInput";
import Scrollbar from "components/Scrollbar";
import useOpenClose from "hooks/useOpenClose";
import { find } from "lodash";
import { FC, useCallback, useMemo, useState } from "react";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";

const ToolTipBox = styled("div")(({ theme }) => ({
  ".search-field": {
    marginBottom: "16px",
    background: theme.palette.common.blackshades?.["12p"],

    ".MuiInputBase-input": {
      height: "40px",
    },
  },

  ".MuiAvatarGroup-root": {
    justifyContent: "flex-end",
    marginBottom: "15px",
  },
}));

const ScrollWrapper = styled("div")(({ theme }) => ({
  margin: "0 -15px 0 0",

  ".rc-scollbar": {
    padding: "0 15px 0 0",
  },
}));

type UserOption = {
  id: string;
  title?: string;
  subtitle?: string;
  image?: string | { name: string; url: string };
};

type Props = {
  options?: UserOption[];
  placeholder?: string;
  actionButtons?: boolean;
  tooltipProps?: Partial<TooltipProps>;
  children?(params: {
    selectedValues: UserOption[];
    onClose(): void;
  }): React.ReactNode;
} & (
  | {
      value: string[];
      multi: true;
      onChange(value: string[], methods?: { onClose?(): void }): void;
    }
  | {
      value: string;
      multi?: false;
      onChange(value: string, methods?: { onClose?(): void }): void;
    }
);

const TooltipSelector: FC<Props> = (props) => {
  const {
    value,
    multi = false,
    placeholder = "Select",
    options = [],
    actionButtons = true,
    tooltipProps = {},
    children,
  } = props;
  const [isOpen, onOpen, onClose, onToggle] = useOpenClose();
  const [searchValue, setSearchValue] = useState<string>("");
  const theme = useTheme();

  const handleClick = (item: any) => {
    if (props.multi) {
      const newValue = Array.isArray(props.value) ? props.value : [props.value];
      const alreadySelected = newValue.includes(item.id);
      if (alreadySelected) {
        const afterRemoving = newValue.filter((v) => v !== item.id);
        return props.onChange(afterRemoving, { onClose });
      }

      props.onChange([...newValue, item.id], { onClose });
    } else {
      props.onChange(item.id, { onClose });
    }
  };

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const filterData = useMemo(() => {
    if (searchValue?.length > 0) {
      return options.filter((option) => option.title?.startsWith(searchValue));
    }
    return options;
  }, [searchValue, options]);

  const selectOptions = useMemo(() => {
    if (Array.isArray(value)) {
      return options.filter((opt) => value.includes(opt.id));
    }
    return [find(options, { id: value })];
  }, [options, value]);

  const checkIsSelect = useCallback(
    (id: string) => {
      if (multi) return value?.includes(id);
      return id === value;
    },
    [multi, value]
  );

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Box>
        <Tooltip
          open={isOpen}
          arrow
          slotProps={{
            tooltip: {
              sx: { maxWidth: "inherit", width: 470 },
            },
          }}
          title={
            <ToolTipBox>
              <Typography variant="body1" component="div" mb={2}>
                User list
              </Typography>

              {!!selectOptions?.length && (
                <AvatarGroup max={4}>
                  {selectOptions?.map((item) => (
                    <Avatar
                      src={
                        typeof item?.image === "string"
                          ? item?.image
                          : item?.image?.url
                      }
                      alt={item?.title}
                    >
                      {item?.title?.[0]?.toLocaleUpperCase()}
                    </Avatar>
                  ))}
                </AvatarGroup>
              )}
              <SearchInput onChange={onSearch} />
              {!!options.length && (
                <ScrollWrapper>
                  <Scrollbar autoHeight autoHeightMax={240}>
                    <Stack gap={0.75}>
                      {filterData?.map((item) => {
                        return (
                          <ProfileCard
                            selected={checkIsSelect(item.id)}
                            onClick={() => handleClick(item)}
                            subTitle={item.subtitle}
                            options={{ draggable: false, switcher: false }}
                            title={item.title!}
                            AvatarImage={
                              <Avatar
                                src={
                                  typeof item?.image === "string"
                                    ? item?.image
                                    : item?.image?.url
                                }
                              >
                                {item?.title?.[0]?.toLocaleUpperCase()}
                              </Avatar>
                            }
                            // rightIcon={
                            //   <LensIcon
                            //     sx={{
                            //       width: "10px",
                            //       height: "10px",
                            //       color: theme.palette.success.main,
                            //     }}
                            //   />
                            // }
                          />
                        );
                      })}
                    </Stack>
                  </Scrollbar>
                </ScrollWrapper>
              )}
              {actionButtons && (
                <Stack
                  direction="row"
                  justifyContent="center"
                  pt={2.5}
                  gap={1.75}
                >
                  <Button
                    size="small"
                    color="inherit"
                    sx={{
                      bgcolor: theme.palette.background.GF10,
                      color: theme.palette.background.GF50,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="small" variant="contained">
                    Save
                  </Button>
                </Stack>
              )}
            </ToolTipBox>
          }
          {...tooltipProps}
        >
          <Box onClick={() => onOpen()}>
            {children ? (
              children({
                selectedValues: selectOptions.filter(Boolean),
                onClose: onClose,
              })
            ) : (
              <ProfileCard
                options={{ draggable: false, switcher: false }}
                title={selectOptions?.[0]?.title || placeholder}
                AvatarImage={
                  <AvatarGroup max={4}>
                    {selectOptions.length > 0 ? (
                      selectOptions?.map((item) => (
                        <Avatar
                          src={
                            typeof item?.image === "string"
                              ? item?.image
                              : item?.image?.url
                          }
                        >
                          {item?.title?.[0]?.toLocaleUpperCase()}
                        </Avatar>
                      ))
                    ) : (
                      <Avatar>NA</Avatar>
                    )}
                  </AvatarGroup>
                }
              />
            )}
          </Box>
        </Tooltip>
      </Box>
    </ClickAwayListener>
  );
};

export default TooltipSelector;
