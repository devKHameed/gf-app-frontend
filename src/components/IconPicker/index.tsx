import {
  Avatar,
  Box,
  ClickAwayListener,
  InputAdornment,
  Paper,
  TextField,
  TextFieldProps,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DividerItem from "components/IconPicker/DividerItem";
import GenericIcon from "components/util-components/Icon";
import { Icons } from "constants/index";
import React, { useEffect, useState } from "react";
import IconPicker from "./IconPicker";

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
))({
  backgroundColor: "transparent",
  maxWidth: "none",
  padding: 0,

  [`& .${tooltipClasses.arrow}::before`]: {
    backgroundColor: "#121212",
  },
});

type Props = {
  icons?: Icon[];
  groupKey?: keyof Icon;
  value?: string;
  placement?: TooltipProps["placement"];
  onChange?: (iconSlug: string) => void;
  textFieldProps?: TextFieldProps;
  compact?: boolean;
};

const IconPickerField: React.FC<Props> = (props) => {
  const {
    onChange,
    value,
    icons = [],
    placement,
    textFieldProps,
    compact = false,
    ...rest
  } = props;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Icon>();

  useEffect(() => {
    if (value) {
      setSelected(icons.find((icon) => icon.slug === value));
    }
  }, [value, icons]);

  return (
    <StyledTooltip
      open={open}
      arrow
      disableFocusListener
      disableHoverListener
      disableTouchListener
      placement={placement || "bottom"}
      title={
        <ClickAwayListener
          onClickAway={() => {
            setOpen(false);
          }}
        >
          <Paper sx={{ width: 500 }}>
            <IconPicker
              {...rest}
              value={selected?.slug}
              icons={icons}
              onSelectIcon={(iconSlug) => {
                setOpen(false);
                setSelected(icons.find((i) => i.slug === iconSlug));
                onChange?.(iconSlug);
              }}
            />
          </Paper>
        </ClickAwayListener>
      }
    >
      {compact ? (
        <div onClick={() => setOpen(true)}>
          <DividerItem
            title={value}
            fileSize="Icon"
            icon={selected?.native_ref}
          />
        </div>
      ) : (
        <TextField
          variant="outlined"
          onClick={() => setOpen(true)}
          value={selected?.title}
          InputProps={{
            endAdornment: selected ? (
              <InputAdornment position="end">
                {selected.native_ref ? (
                  <GenericIcon
                    iconName={selected.native_ref as Icons}
                    key={selected.native_ref}
                  />
                ) : (
                  <Avatar
                    src={selected.svg}
                    variant="square"
                    sx={{ background: "transparent" }}
                  >
                    <Box
                      component="div"
                      dangerouslySetInnerHTML={{ __html: selected.svg }}
                    ></Box>
                  </Avatar>
                )}
              </InputAdornment>
            ) : null,
          }}
          {...textFieldProps}
        />
      )}
    </StyledTooltip>
  );
};

export default IconPickerField;
