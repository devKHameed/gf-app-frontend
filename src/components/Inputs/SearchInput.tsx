import { styled } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/SearchOutlined";
import { InputBase, InputBaseProps } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  // borderRadius: theme.shape.borderRadius,
  borderRadius: "4px",
  backgroundColor: theme.palette.background.GF7,
  "&:hover": {
    backgroundColor: theme.palette.background.GF7,
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    // marginLeft: theme.spacing(1),
    width: "auto",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1.25),
  right: "0",
  top: "0",
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.4s ease",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.625, 1.375, 0.625, 1.375),
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    height: "30px",
    boxSizing: "border-box",
    // [theme.breakpoints.up("sm")]: {
    //   width: "12ch",
    //   "&:focus": {
    //     width: "20ch",
    //   },
    // },
  },
}));

export default function SearchInput(props: InputBaseProps) {
  return (
    <Search className="search-field">
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        {...props}
      />
      <SearchIconWrapper className="search-icon">
        <SearchIcon sx={{ width: "16px" }} />
      </SearchIconWrapper>
    </Search>
  );
}
