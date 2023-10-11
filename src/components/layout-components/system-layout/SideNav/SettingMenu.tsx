import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useSignOut from "queries/auth/useSignOut";
import React from "react";
import { Link } from "react-router-dom";

type Props = {} & React.ComponentProps<typeof Menu>;

const SettingMenu = ({ children, ...rest }: Props) => {
  const { mutate: handleSignOut, isLoading } = useSignOut();

  const handleLogout = () => {
    handleSignOut();
  };
  return (
    <Menu {...rest}>
      <MenuItem>
        <Link to="/profile">Profile</Link>
      </MenuItem>
      <MenuItem>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
};

export default SettingMenu;
