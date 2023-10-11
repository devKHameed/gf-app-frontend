import { Paper } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import type { ComponentMeta } from "@storybook/react";
import { useState } from "react";

export default {
  title: "CompoundComponent/Forms",
  component: TextField,
} as ComponentMeta<typeof TextField>;

const CheckboxCompoent = () => {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setChecked(checked);
  };

  return (
    <Card sx={{ background: theme.palette.background.GFRightNavBackground }}>
      <CardContent>
        <Stack spacing={1}>
          <InputLabel
            htmlFor="my-input"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Check box
          </InputLabel>
          <Paper elevation={1} sx={{ px: 1.5, boxShadow: "none" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  name="gilad"
                />
              }
              label="Label of the checkbox"
            />
          </Paper>

          <CardActions
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button
              color="inherit"
              sx={{
                bgcolor: theme.palette.primary.main,
              }}
            >
              Save Changes
            </Button>
          </CardActions>
        </Stack>
      </CardContent>
    </Card>
  );
};
const RadioCompoent = () => {
  const theme = useTheme();

  return (
    <Card sx={{ background: theme.palette.background.GFRightNavBackground }}>
      <CardContent>
        <Stack spacing={1}>
          <InputLabel
            htmlFor="my-input"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Radio button
          </InputLabel>
          <Paper elevation={1} sx={{ px: 1.5, boxShadow: "none" }}>
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Label of Radio Button"
            />
          </Paper>
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button
              color="inherit"
              sx={{
                bgcolor: theme.palette.primary.main,
              }}
            >
              Save Changes
            </Button>
          </CardActions>
        </Stack>
      </CardContent>
    </Card>
  );
};
export const Default = () => {
  const theme = useTheme();
  const [age, setAge] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Stack spacing={2}>
      <Card sx={{ background: theme.palette.background.GFRightNavBackground }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={1}>
            <InputLabel
              htmlFor="my-input"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Text Field
            </InputLabel>
            <TextField
              label="Email"
              id="my-input"
              variant="outlined"
              aria-describedby="my-helper-text"
            />
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button
                color="inherit"
                sx={{
                  bgcolor: theme.palette.primary.main,
                }}
              >
                Save Changes
              </Button>
            </CardActions>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ background: theme.palette.background.GFRightNavBackground }}>
        <CardContent>
          <Stack spacing={1}>
            <InputLabel
              htmlFor="my-input"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Text Field
            </InputLabel>
            <FormControl variant="outlined">
              <TextField
                id="outlined-multiline-static"
                label="Multiline"
                multiline
                hiddenLabel
                rows={4}
                fullWidth
                defaultValue="Default Value"
              />
              <FormHelperText id="outlined-weight-helper-text">
                0/100
              </FormHelperText>
            </FormControl>
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button
                color="inherit"
                sx={{
                  bgcolor: theme.palette.primary.main,
                }}
              >
                Save Changes
              </Button>
            </CardActions>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ background: theme.palette.background.GFRightNavBackground }}>
        <CardContent>
          <Stack spacing={1}>
            <InputLabel
              htmlFor="my-input"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Text Field
            </InputLabel>

            <FormControl fullWidth color="error">
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>

            <CardActions
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button
                color="inherit"
                sx={{
                  bgcolor: theme.palette.primary.main,
                }}
              >
                Save Changes
              </Button>
            </CardActions>
          </Stack>
        </CardContent>
      </Card>
      <CheckboxCompoent />
      <RadioCompoent />
    </Stack>
  );
};
