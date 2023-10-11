import ExpandIcon from "@mui/icons-material/Expand";
import {
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { CanvasSettingWrap } from "./index.style";
type ICanvasProps = {};
export const CanvasSetting = (props: ICanvasProps) => {
  const theme = useTheme();
  return (
    <CanvasSettingWrap>
      <Typography variant="subtitle1" mb={2.5}>
        Canvas settings
      </Typography>
      <Stack direction="row" alignItems="center" gap={1.5} mb={2.5}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <InputLabel id="Width" sx={{ color: theme.palette.common.white }}>
            Width:
          </InputLabel>
          <TextField
            size="small"
            sx={{ maxWidth: "120px" }}
            hiddenLabel={true}
            id="Width"
            InputProps={{
              endAdornment: <InputAdornment position="end">PX</InputAdornment>,
            }}
          />
        </Stack>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <InputLabel id="Scale" sx={{ color: theme.palette.common.white }}>
            Scale:
          </InputLabel>
          <TextField
            size="small"
            hiddenLabel={true}
            id="Scale"
            sx={{ maxWidth: "120px" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Stack>
        <ExpandIcon />
      </Stack>
      <Stack mb={2.5}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Show element edges"
          />
          <FormControlLabel control={<Checkbox />} label="Label" />
          <FormControlLabel control={<Checkbox />} label="Label" />
        </FormGroup>
      </Stack>
      <Stack mb={2.5}>
        <FormControl fullWidth color="error">
          <InputLabel id="demo-simple-select-label">Label</InputLabel>
          <Select
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Label"
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack mb={2.5}>
        <InputLabel sx={{ color: theme.palette.common.white, mb: 1 }}>
          Vision preview
        </InputLabel>
        <FormControl fullWidth color="error">
          <InputLabel id="Width">label</InputLabel>
          <Select
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Divider variant="middle" />
      <InputLabel sx={{ color: theme.palette.common.white, mb: 1 }}>
        Text zoom preview
      </InputLabel>
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <TextField
            size="small"
            hiddenLabel={true}
            id="Width"
            sx={{ maxWidth: "120px", width: "100%" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">PX</InputAdornment>,
            }}
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            hiddenLabel={true}
            id="Width"
            sx={{ maxWidth: "56px", width: "100%" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">PX</InputAdornment>,
            }}
          />
          <TextField
            size="small"
            hiddenLabel={true}
            id="Width"
            sx={{ maxWidth: "64px", width: "100%" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">PX</InputAdornment>,
            }}
          />
          <TextField
            size="small"
            hiddenLabel={true}
            id="Width"
            sx={{ maxWidth: "64px", width: "100%" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">PX</InputAdornment>,
            }}
          />
          <Button
            size="large"
            variant="contained"
            sx={{
              background: theme.palette.text.primary_shades?.["12p"],
              height: "40px",
              boxShadow: "none",
              fontWeight: 400,
            }}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
    </CanvasSettingWrap>
  );
};
