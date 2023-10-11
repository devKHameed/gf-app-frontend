import { TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { BaseParamFieldProps } from "../NodeEditorFields";

type IntegerFieldProps = {} & BaseParamFieldProps;

const IntegerField: React.FC<IntegerFieldProps> = (props) => {
  const { field, parentNamePath, control } = props;
  const { name: fieldName } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <TextField
            {...field}
            variant="filled"
            size="small"
            // type="number"
            fullWidth
          />
        );
      }}
    />
  );
};

export default IntegerField;
