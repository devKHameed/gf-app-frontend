import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import {
  Collapse,
  FormControl,
  FormHelperText,
  FormHelperTextProps,
  FormLabel,
  FormLabelProps,
  IconButton,
  Stack,
  styled,
  useTheme,
} from "@mui/material";
import LabelArrowIcon from "assets/icons/LabelArrowIcon";
import React, { PropsWithChildren, useImperativeHandle, useState } from "react";

type Props = {
  label?: string;
  labelProps?: FormLabelProps;
  help?: string;
  helpProps?: FormHelperTextProps;
  error?: string;
  errorProps?: FormHelperTextProps;
  extra?: React.ReactNode;
};

const FormHelperTextWrap = styled(FormHelperText)(({ theme }) => ({
  lineHeight: "143%",
  fontWeight: 400,
}));

const FormFieldWrap = styled(FormControl)(({ theme }) => ({
  marginBottom: "16px",

  "&:last-child": {
    marginBottom: "0",
  },

  "&.MuiCollapse-root:not(.MuiCollapse-entered )": {},

  ".MuiFormLabel-root": {
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: "600",
  },
}));

export type FlowFieldWrapperRef = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const FlowFieldWrapper = React.forwardRef<
  FlowFieldWrapperRef | undefined,
  PropsWithChildren<Props>
>((props, ref) => {
  const {
    label,
    help,
    error,
    labelProps = {},
    helpProps = {},
    errorProps = {},
    children,
    extra,
  } = props;

  const theme = useTheme();

  const [collapsed, setCollapsed] = useState(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        collapsed,
        setCollapsed,
      };
    },
    [collapsed, setCollapsed]
  );

  return (
    <FormFieldWrap fullWidth>
      <Collapse in={!collapsed} collapsedSize={20}>
        {label && (
          <Stack
            sx={{ mb: 1.5 }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing={1} direction="row" alignItems="center">
              <IconButton
                sx={{ p: 0 }}
                onClick={() => setCollapsed((prev) => !prev)}
              >
                <LabelArrowIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <FormLabel {...labelProps}>{label}</FormLabel>
            </Stack>
            {extra}
          </Stack>
        )}
        {children}
        {help && (
          <Stack
            sx={{ mt: 2 }}
            spacing={1.25}
            direction="row"
            alignItems="flex-start"
          >
            <EmojiObjectsOutlinedIcon
              sx={{
                fontSize: 16,
                color: theme.palette.green.GFShocking,
                marginTop: "2px",
              }}
            />
            <FormHelperTextWrap {...helpProps}>{help}</FormHelperTextWrap>
          </Stack>
        )}
        {error && (
          <FormHelperTextWrap {...errorProps} error>
            {error}
          </FormHelperTextWrap>
        )}
      </Collapse>
    </FormFieldWrap>
  );
});

export default FlowFieldWrapper;
