import { MenuItem, Select } from "@mui/material";
import timezones from "assets/data/timezones.json";
import React from "react";
import { BaseParamFieldProps } from "../NodeEditorFields";

type TimezoneFieldProps = {} & BaseParamFieldProps;

const TimezoneField: React.FC<TimezoneFieldProps> = (props) => {
  const { field, register, parentNamePath } = props;
  const { name: fieldName } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  return (
    <Select
      {...register(name)}
      displayEmpty
      id={name}
      fullWidth
      // MenuProps={{
      //   disablePortal: true,
      // }}
      defaultValue=""
      // sx={{ ".MuiPaper-root": { left: "30px !important" } }}
      size="small"
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {timezones.map((op) => (
        <MenuItem key={op} value={op}>
          {op}
        </MenuItem>
      ))}
    </Select>
  );
};

export default TimezoneField;
