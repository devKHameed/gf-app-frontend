import { Close, Search } from "@mui/icons-material";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  OutlinedInputProps,
  styled,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const SearchBox = styled(FormControl)(({ theme }) => ({
  ".MuiInputBase-root": {
    paddingRight: "8px",
  },

  "&:hover": {
    ".MuiOutlinedInput-notchedOutline ": {
      borderColor: theme.palette.background.GF60,
    },
  },

  ".Mui-focused": {
    ".MuiOutlinedInput-notchedOutline ": {
      borderColor: `${theme.palette.background.GF60} !important`,
      borderWidth: "1px !important",
    },

    ".MuiInputBase-input": {
      "&::placeholder": {
        color: "transparent",
        opacity: "0",
      },
    },
  },

  ".MuiInputBase-input": {
    fontSize: "14px",
    fontWeight: "400",
    boxSizing: "border-box",
    height: "30px",
    padding: "7px 8px 7px 11px",

    "&::placeholder": {
      color: theme.palette.background.GF50,
      opacity: "1",
    },
  },

  ".MuiInputAdornment-root": {
    width: "19px",
    cursor: "pointer",
    color: theme.palette.background.GF60,
    transition: "all 0.4s ease",

    "&:hover": {
      color: theme.palette.text.primary,
    },

    svg: {
      width: "100%",
      height: "auto",
      display: "block",
    },
  },

  ".MuiOutlinedInput-notchedOutline ": {
    borderColor: theme.palette.background.GF40,
    transition: "all 0.4s ease",
  },
}));

const SearchInputElement: React.FC<OutlinedInputProps> = ({
  value: pValue,
  onChange,
  ...rest
}) => {
  const [value, setValue] = useState<any>();
  const ref = useRef<HTMLInputElement>();
  useEffect(() => {
    setValue(pValue);
  }, [pValue]);

  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    onChange?.(e);
    setValue(e.target.value);
  };
  const handleClear = () => {
    setValue("");
    onChange?.({ target: { value: "" } } as any);
  };
  return (
    <OutlinedInput
      id="outlined-adornment-password"
      placeholder="Search..."
      value={value}
      size="small"
      sx={{ m: 0 }}
      endAdornment={
        <InputAdornment position="end">
          {value ? <Close onClick={handleClear} /> : <Search />}
        </InputAdornment>
      }
      // label="Password"
      onChange={handleChange}
      ref={ref}
      {...rest}
    />
  );
};
const SearchInput = ({ ...rest }: OutlinedInputProps) => {
  return (
    <SearchBox
      sx={{ width: "100%" }}
      variant="outlined"
      size="small"
      className="search-field"
      hiddenLabel
    >
      <SearchInputElement
        id="outlined-adornment-password"
        placeholder="Search..."
        {...rest}
      />
    </SearchBox>
  );
};

export default SearchInput;
