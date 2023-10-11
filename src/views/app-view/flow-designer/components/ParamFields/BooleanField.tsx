import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { BaseParamFieldProps } from "../NodeEditorFields";

type BooleanFieldProps = {} & BaseParamFieldProps;

const BooleanField: React.FC<BooleanFieldProps> = (props) => {
  const { field, control, parentNamePath } = props;
  const { name: fieldName, required } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <RadioGroup
            row
            value={field.value === null ? "" : `${field.value}`}
            onChange={(e) => {
              field.onChange(
                e.target.value === "" ? null : e.target.value === "true"
              );
            }}
            defaultValue={false}
          >
            <FormControlLabel
              value={true}
              control={<Radio size="small" />}
              label="Yes"
            />
            <FormControlLabel
              value={false}
              control={<Radio size="small" />}
              label="No"
            />
            {!required ? (
              <FormControlLabel
                value=""
                control={<Radio size="small" />}
                label="Empty"
              />
            ) : null}
          </RadioGroup>
        );
      }}
    />
  );
};

export default BooleanField;
