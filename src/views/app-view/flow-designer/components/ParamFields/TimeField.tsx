import { TextField } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import React from "react";
import { Controller } from "react-hook-form";
import { BaseParamFieldProps } from "../NodeEditorFields";

type TimeFieldProps = {} & BaseParamFieldProps;

const TimeField: React.FC<TimeFieldProps> = (props) => {
  const { field, parentNamePath, control } = props;
  const { name: fieldName } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
              value={moment(value, "HH:mm")}
              onChange={(value) => onChange(value?.format("HH:mm") || "")}
              renderInput={(params) => (
                <TextField {...params} variant="filled" fullWidth />
              )}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
};

export default TimeField;
