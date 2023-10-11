import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useAccountSlug from "hooks/useAccountSlug";
import useSignOut from "queries/auth/useSignOut";
import React from "react";
import { Link } from "react-router-dom";

type Props = {} & React.ComponentProps<typeof Menu>;

const SettingMenu = ({ children, ...rest }: Props) => {
  const { mutate: handleSignOut, isLoading } = useSignOut();
  const accountSlug = useAccountSlug();

  const handleLogout = () => {
    handleSignOut();
  };
  return (
    <Menu
      {...rest}
      sx={{
        a: {
          color: "text.primary",
          "text-decoration": "none",
          width: "100%",
          padding: "6px 16px",
        },
        li: {
          padding: 0,
        },
      }}
    >
      <MenuItem>
        <Link to="/profile">Profile</Link>
      </MenuItem>
      <MenuItem>
        <Link to={`/${accountSlug}/dataset-design`}>System Setting</Link>
      </MenuItem>
      <MenuItem>
        <Link to="">My account</Link>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <Link to="">Logout</Link>
      </MenuItem>
    </Menu>
  );
};

export default SettingMenu;
