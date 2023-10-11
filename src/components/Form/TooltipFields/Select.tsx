import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { InputAdornment, TooltipProps } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { alpha, styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { FormFieldProps } from "components/FormField";
import React from "react";
import FormFieldTooltipWrapper from "../FormFieldTooltipWrapper";
type Props = {
  name: string;
  options?: { label: string; value: string }[];
  tooltipProps?: Partial<TooltipProps>;
  baseElementProps?: React.ComponentProps<typeof TooltipBaseElement>;
  tooltipInlineElementProps?: React.ComponentProps<typeof SelectWrapper>;
  [key: string]: any;
} & FormFieldProps;

export const TooltipBaseElement = styled(TextField)<{
  isTooltipOpen?: boolean;
}>(({ isTooltipOpen, theme }) => {
  return {
    ...(isTooltipOpen && {
      ".MuiInputBase-root": {
        border: `2px solid ${alpha(theme.palette.text.primary, 0.3)}`,
        background: `${theme.palette.background.GF10} !important`,
      },
    }),
  };
});

export const SelectWrapper = styled(Select)(() => {
  return {
    ".MuiPopover-root ": {
      position: "absolute",
      left: "0",
      top: "100%",
      bottom: "auto",
    },

    ".MuiPaper-root ": {
      position: "absolute",
      left: "0 !important",
      top: "0 !important",
      maxHeight: "200px !important",
    },
  };
});

const ToolTipSelect = ({
  name,
  options = [],
  label,
  tooltipProps,
  baseElementProps,
  tooltipInlineElementProps,
}: Props) => {
  return (
    <FormFieldTooltipWrapper
      name={name}
      label={label}
      tooltipProps={tooltipProps}
      render={({ field, fieldRef, isTooltipOpen, isBaseElement }) => {
        if (isBaseElement)
          return (
            <TooltipBaseElement
              value={field.value}
              isTooltipOpen={isTooltipOpen}
              variant="filled"
              size="small"
              disabled
              hiddenLabel
              {...baseElementProps}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <ExpandMoreOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          );

        return (
          <SelectWrapper
            {...field}
            value={field.value || []}
            size="small"
            variant="filled"
            id="test"
            defaultOpen
            sx={{
              minHeight: "40px",
            }}
            MenuProps={{
              disablePortal: true,
            }}
            inputRef={fieldRef}
            {...tooltipInlineElementProps}
          >
            {options?.map((opt) => (
              <MenuItem value={opt.value}>{opt.label}</MenuItem>
            ))}
          </SelectWrapper>
        );
      }}
    />
  );
};

export default ToolTipSelect;
