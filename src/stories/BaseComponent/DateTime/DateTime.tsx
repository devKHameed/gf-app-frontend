import { DateTimePickerProps } from "@mui/lab";
import Stack from "@mui/material/Stack/Stack";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import {
  MobileDatePicker,
  MobileDateTimePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DateTimePicker,
  DateTimePickerTabs,
  DateTimePickerTabsProps,
} from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
const CustomTabs = (props: DateTimePickerTabsProps) => (
  <>
    <DateTimePickerTabs {...props} />
    {/* <Box sx={{ backgroundColor: "blueviolet", height: 5 }} /> */}
  </>
);

export function NativePickers(props: TextFieldProps) {
  return (
    <Stack spacing={3} width="100%" height={"100%"}>
      <TextField
        id="date"
        label="Birthday"
        type="date"
        fullWidth
        defaultValue="2017-05-24"
        // sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true,
        }}
        {...props}
      />

      <TextField
        id="time"
        label="Alarm clock"
        type="time"
        fullWidth
        defaultValue="07:30"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
        {...props}
        // sx={{ width: 150 }}
      />

      <TextField
        id="datetime-local"
        label="Next appointment"
        type="datetime-local"
        fullWidth
        defaultValue="2017-05-24T10:30"
        // sx={{ width: 250 }}
        InputLabelProps={{
          shrink: true,
        }}
        {...props}
      />
    </Stack>
  );
}
export function MaterialUIPickers(props: DateTimePickerProps<any>) {
  const [value, setValue] = useState<Dayjs | null>(
    dayjs("2014-08-18T21:11:54")
  );

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Date&Time picker"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} variant="filled" />}
            {...props}
          />

          <DateTimePicker
            label="Tabs"
            renderInput={(params) => <TextField {...params} />}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            hideTabs={false}
            components={{ Tabs: CustomTabs }}
            // componentsProps={{
            //   tabs: {
            //     dateRangeIcon: <LightModeIcon />,
            //     timeIcon: <AcUnitIcon />,
            //   },
            // }}
            {...props}
          />
        </LocalizationProvider>
        <MobileDatePicker
          label="Date mobile"
          inputFormat="MM/DD/YYYY"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <MobileDateTimePicker
          label="For Mobile with No toolbar"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
          // showToolbar={false}
          {...props}
        />

        <MobileDateTimePicker
          label="For mobile"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
          showToolbar={false}
          {...props}
        />
        <TimePicker
          label="Time"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
          {...props}
        />
      </Stack>
    </LocalizationProvider>
  );
}
