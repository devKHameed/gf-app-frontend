import { FormControl, FormLabel, FormLabelProps } from "@mui/material";
import React, { PropsWithChildren } from "react";

export type Props = {
  label: string;
  labelProps?: FormLabelProps;
};

const Label: React.FC<PropsWithChildren<Props>> = (props) => {
  const { label, labelProps } = props;

  return (
    <FormControl fullWidth>
      {label && <FormLabel {...labelProps}>{label}</FormLabel>}
    </FormControl>
  );
};

export default Label;
