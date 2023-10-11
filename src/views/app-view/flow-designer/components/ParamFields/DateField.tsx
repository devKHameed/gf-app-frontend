import { TextField } from "@mui/material";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import React from "react";
import { Controller } from "react-hook-form";
import { BaseParamFieldProps } from "../NodeEditorFields";

type DateFieldProps = {} & BaseParamFieldProps;

const DateField: React.FC<DateFieldProps> = (props) => {
  const { field, parentNamePath, control } = props;
  const { name: fieldName } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        if (field.time) {
          return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                value={moment(value)}
                onChange={(value) => onChange(value?.format() || "")}
                renderInput={(params) => (
                  <TextField {...params} variant="filled" fullWidth />
                )}
                hideTabs={false}
              />
            </LocalizationProvider>
          );
        }

        return (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              value={moment(value)}
              onChange={(value) => onChange(value?.format() || "")}
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

export default DateField;
