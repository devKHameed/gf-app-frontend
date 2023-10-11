import AcUnitIcon from "@mui/icons-material/AcUnit";
import {
  Box,
  FormControl,
  InputBase,
  ListItemIcon,
  Select,
  SelectChangeEvent,
  Stack,
  SvgIcon,
} from "@mui/material";
import { InputBaseProps } from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import { SelectProps } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import styled from "@mui/material/styles/styled";
import { useState } from "react";

export function SelectIcon(props: SelectProps) {
  const { value, defaultValue, ...rest } = props;
  const theme = useTheme();
  const [departement, setDepartments] = useState("React Team");
  const handleChange = (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => {
    setDepartments(event.target.value);
  };
  return (
    <Stack direction={"row"} flexWrap="wrap">
      <FormControl
        sx={{
          margin: theme.spacing(1),
        }}
      >
        {/* <InputLabel htmlFor="custom_select">Age</InputLabel> */}
        <Select
          value={departement}
          onChange={handleChange}
          // variant="outlined"
          // variant="standard"
          variant="filled"
          sx={{
            background: "none",
            ".MuiSelect-select": {
              p: 1.5,
            },
          }}
          renderValue={(value) => {
            return (
              <Box sx={{ display: "flex", gap: 1 }}>
                <SvgIcon color="inherit">
                  <AcUnitIcon />
                </SvgIcon>
                {value}
              </Box>
            );
          }}
          {...rest}
        >
          <MenuItem value={"None"}>
            <em>None</em>
          </MenuItem>
          {/* <MenuItem value={10} selected>
            <ListItemIcon>
              <DeleteRounded /> Twenty
            </ListItemIcon>
          </MenuItem> */}
          <MenuItem value={"React Team"}>React Team</MenuItem>
          <MenuItem value={"Svelt Team"}>Svelt Team</MenuItem>
          <MenuItem value={"Angular Team"}>Angular Team</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}

const StyledInputBase = styled(InputBase)<InputBaseProps>(({ theme }) => {
  return {
    "&.MuiInputBase-root:hover": {
      background: theme.palette.action.hover,
    },
    "&.MuiInputBase-root.Mui-focused": {
      background: theme.palette.action.selected,
    },
    "& .MuiInputBase-input": {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  };
});

export function SelectCustomItem(props: SelectProps) {
  const { value, defaultValue, ...rest } = props;
  const theme = useTheme();
  const [departement, setDepartments] = useState("React Team");
  const handleChange = (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => {
    setDepartments(event.target.value);
  };
  return (
    <Stack direction={"row"} flexWrap="wrap">
      <FormControl
        sx={{
          margin: theme.spacing(1),
        }}
      >
        {/* <InputLabel htmlFor="custom_select">Age</InputLabel> */}
        <Select
          value={departement}
          onChange={handleChange}
          // variant="outlined"
          // variant="standard"
          variant="filled"
          input={<StyledInputBase name="custom_item" />}
          {...rest}
          sx={{
            ".MuiSelect-select": {
              p: 1.5,
            },
          }}
        >
          <MenuItem value={"None"}>
            <em>None</em>
          </MenuItem>
          <MenuItem
            value={JSON.stringify({ name: "tweety", me: "you" })}
            selected
          >
            <ListItemIcon>
              <AcUnitIcon /> Twenty
            </ListItemIcon>
          </MenuItem>
          <MenuItem value={"React Team"}>React Team</MenuItem>
          <MenuItem value={"Svelt Team"}>Svelt Team</MenuItem>
          <MenuItem value={"Angular Team"}>Angular Team</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
