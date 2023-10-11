import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";

const optionss = [
  { label: "None", value: "none" },
  { labeL: "Atria", value: "atria" },
  { label: "Callisto", value: "callisto" },
];

const ITEM_HEIGHT = 48;
type Item = { label: string; value: string | number };
type IMenuProps = MenuProps & {
  options: Item[];
  onSelect?: (item: Item) => void;
};
export const LongMenu = (props: IMenuProps) => {
  const { options = optionss, open: isOpen, onClose, ...rest } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl || isOpen);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    onClose?.({}, "escapeKeyDown");
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // PaperProps={{
        //   style: {
        //     maxHeight: ITEM_HEIGHT * 4.5,
        //     width: "20ch",
        //   },
        // }}
        {...rest}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === "atria"}
            onClick={handleClose}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
