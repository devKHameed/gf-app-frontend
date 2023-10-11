import { TooltipProps } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { FormFieldProps } from "components/FormField";
import FormFieldTooltipWrapper from "../FormFieldTooltipWrapper";

type Props = {
  name: string;
  tooltipProps?: Partial<TooltipProps>;
  baseElementProps?: React.ComponentProps<typeof TooltipBaseElement>;
  tooltipInlineElementProps?: React.ComponentProps<typeof TextField>;

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

const ToolTipInput = ({
  name,
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
              variant="filled"
              size="small"
              isTooltipOpen={isTooltipOpen}
              hiddenLabel
              disabled
              {...baseElementProps}
            />
          );
        return (
          <TextField
            {...field}
            inputRef={fieldRef}
            variant="filled"
            size="small"
            hiddenLabel
            {...tooltipInlineElementProps}
          />
        );
      }}
    />
  );
};

export default ToolTipInput;
