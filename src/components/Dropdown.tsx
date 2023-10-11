import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import * as React from "react";

const optionss = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelt", value: "svelt" },
];
type Item = {
  label: string;
  value: string | number;
};
type IDropDown = {
  options: Item[];
  open?: boolean;
  onOpen?: (isOpen: boolean) => void | Promise<any>;
  onItemSelect?: (option: Item) => void | Promise<any>;
};
export default function ButtonDropdown(props: IDropDown) {
  const {
    open: isdropDownOpen,
    onOpen,
    onItemSelect,
    options = optionss,
  } = props;
  const [open, setOpen] = React.useState(!!isdropDownOpen);
  const anchorRef = React.useRef<any>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClick = () => {
    // console.info(`You clicked ${options[selectedIndex].label}`);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    onItemSelect?.(options[selectedIndex]);
    setOpen(false);
    onOpen?.(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    onOpen?.(!open);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    onOpen?.(false);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton
        disableRipple
        ref={anchorRef}
        size="small"
        aria-controls={open ? "split-button-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-label="select merge strategy"
        aria-haspopup="menu"
        onClick={handleToggle}
      >
        <ArrowDropDownIcon /> {options[selectedIndex].label}
      </IconButton>

      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.label}
                      //   disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
