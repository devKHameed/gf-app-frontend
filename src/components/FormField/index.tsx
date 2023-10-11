import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  FormLabelProps,
} from "@mui/material";
import React, { PropsWithChildren } from "react";
import { FieldError } from "react-hook-form";

type Props = {
  label?: string;
  labelProps?: FormLabelProps;
  error?: FieldError;
} & Omit<FormControlProps, "error">;

export type FormFieldProps = Props;
const FormField: React.FC<PropsWithChildren<Props>> = (props) => {
  const { label, labelProps, error, children, ...formControlProps } = props;

  return (
    <FormControl fullWidth error={!!error} {...formControlProps}>
      {label && <FormLabel {...labelProps}>{label}</FormLabel>}
      {children}
      {!!error && <FormHelperText>{error?.message}</FormHelperText>}
    </FormControl>
  );
};

export default FormField;
