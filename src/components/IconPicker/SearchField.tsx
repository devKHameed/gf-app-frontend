import { Close, Search } from "@mui/icons-material";
import { Box, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Props = TextFieldProps & {
  onClear?: () => void;
};

const SearchField = (props: Props) => {
  const {
    onChange: onChangeEvent,
    value = "",
    onClear,
    label = "Search",
  } = props;

  const onChange: Props["onChange"] = (event) => {
    onChangeEvent?.(event);
  };
  const onhandleClear = () => {
    onClear?.();
  };
  const theme = useTheme();

  return (
    <Box>
      <TextField
        size="small"
        sx={{
          background: theme.palette.background.GFRightNavBackground,
          mb: "16px",
          width: "100%",
          ".MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        label={label}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {value === "" ? <Search /> : <Close onClick={onhandleClear} />}
            </InputAdornment>
          ),
        }}
        onChange={onChange}
        {...props}
      />
    </Box>
  );
};

export default SearchField;
