// import PropTypes from 'prop-types';
//
import { GlobalStyles, Theme } from "@mui/material";
import SettingsDrawer from "./drawer";
//
import Box from "@mui/material/Box";
import { ReactNode } from "react";

type IThemeSettingsProps = {
  children: ReactNode;
};

const customSwalStyles = (theme: Theme) => {
  return `
    .swal2-cancel.swal2-styled.swal2-default-outline {
      background: transparent !important;
      border: 2px solid  ${theme.palette?.primary?.main} !important;
    }
    .swal2-confirm.swal2-styled.swal2-default-outline {
      background-color: ${theme.palette?.primary?.main} !important;
      border: 2px solid  ${theme.palette?.primary?.main} !important;
    }
`;
};
export default function ThemeSettings({ children }: IThemeSettingsProps) {
  return (
    <Box sx={{ height: "100%" }}>
      <GlobalStyles styles={(theme) => customSwalStyles(theme)} />
      {children}
      <SettingsDrawer />
    </Box>
  );
}
