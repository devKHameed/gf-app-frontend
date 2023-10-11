import { styled } from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import AppBarComp, { AppBarProps } from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import ArrowBack from "assets/icons/ArrowBack";
import classNames from "classnames";
import useAccountSlug from "hooks/useAccountSlug";
// import ArrowBack from "assets/icons/ArrowBack";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type SystemAppBarProps = AppBarProps & {
  title?: ReactNode;
  DropDown: React.ReactNode | React.ReactElement;
  leftIcon?: React.ReactNode | React.ReactElement;
  centeredComponent?: React.ReactNode | React.ReactElement;
  onLeftIconClick?: React.MouseEventHandler<HTMLButtonElement>;
  rightComponent?: React.ReactNode;
  leftMenuClasses?: string;
};

const AppBarWrap = styled(AppBarComp)(({ theme }) => ({
  ".MuiToolbar-root": {
    minHeight: "60px !important",
  },

  ".arrow-back": {
    "&:hover": {
      opacity: "0.6",
    },
  },

  ".full-width": {
    width: "100%",
  },

  ".menu-left": {
    ".right-column": {
      flexGrow: "1",
      flexBasis: "0",
      minWidth: "0",
      marginLeft: "0",

      ".MuiStack-root": {
        width: "100%",
        justifyContent: "space-between",
      },
    },
  },
}));

const SystemAppBar = (props: SystemAppBarProps) => {
  const {
    title = "System Settings",
    DropDown,
    leftIcon = (
      <ArrowBack
        sx={{
          width: "24px",
          height: "24px",
          padding: "4px",
          marginRight: "12px",
        }}
      />
    ),
    centeredComponent,
    onLeftIconClick,
    rightComponent,
    leftMenuClasses,
    ...rest
  } = props;

  const navigate = useNavigate();

  const selectedAccount = useAccountSlug();

  return (
    <AppBarWrap position="fixed" {...rest}>
      <Toolbar>
        <Stack
          className={classNames("full-width", leftMenuClasses)}
          direction="row"
          justifyContent="space-between"
          spacing={2}
          alignItems="center"
        >
          <Stack className="left-column" direction="row" alignItems="center">
            <IconButton
              className="arrow-back"
              size="small"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              disableRipple
              sx={{ p: "0" }}
              onClick={
                onLeftIconClick ??
                (() => {
                  selectedAccount && navigate(`/${selectedAccount}/app`);
                })
              }
            >
              {leftIcon}
              <AlertTitle sx={{ mb: "0" }}>{title}</AlertTitle>
            </IconButton>
          </Stack>
          <Stack
            className="center-column"
            direction="row"
            display={{ xs: "none", md: "flex" }}
            justifyContent="center"
          >
            {centeredComponent}
          </Stack>
          <Stack
            className="right-column"
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
          >
            {rightComponent}
            {DropDown}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBarWrap>
  );
};

export default SystemAppBar;
