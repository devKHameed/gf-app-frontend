import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";
// @mui
import {
  Backdrop,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
// hooks
import useSettings from "hooks/useSettings";
// utils
import cssStyles from "utils/cssStyles";
// config
import { defaultSettings, NAVBAR } from "configs";
//
import Iconify from "components/Iconify";
// import Scrollbar from "components/SimpleScrollbar";
import Scrollbar from "components/Scrollbar";
//
import AntSwitch from "components/AntSwitch";
import SettingColorPresets from "./SettingColorPresets";
import SettingFullscreen from "./SettingFullscreen";
import ToggleButton from "./ToggleButton";

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  ...cssStyles(theme).bgBlur({
    color: theme.palette.background.paper,
    opacity: 0.92,
  }),
  top: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  position: "fixed",
  overflow: "hidden",
  width: NAVBAR.BASE_WIDTH,
  flexDirection: "column",
  margin: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  zIndex: theme.zIndex.drawer + 3,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: `-24px 12px 32px -4px ${alpha(
    theme.palette.mode === "light"
      ? theme.palette.grey[500]
      : theme.palette.common.black,
    0.16
  )}`,
}));

// ----------------------------------------------------------------------

export default function SettingsDrawer() {
  const {
    themeMode,
    themeLayout,
    themeDirection,
    onResetSetting,
    onToggleMode,
  } = useSettings();

  const [open, setOpen] = useState(false);

  const notDefault =
    themeMode !== defaultSettings.themeMode ||
    themeLayout !== defaultSettings.themeLayout ||
    themeDirection !== defaultSettings.themeDirection;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Backdrop
        open={open}
        onClick={handleClose}
        sx={{
          background: "transparent",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      />

      {!open && (
        <ToggleButton
          open={open}
          notDefault={notDefault}
          onToggle={handleToggle}
        />
      )}

      <AnimatePresence>
        {open && (
          <>
            <RootStyle>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ py: 2, pr: 1, pl: 2.5 }}
              >
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                  Settings
                </Typography>

                <IconButton onClick={onResetSetting}>
                  <Iconify icon={"ic:round-refresh"} width={20} height={20} />
                </IconButton>

                <IconButton onClick={handleClose}>
                  <Iconify icon={"eva:close-fill"} width={20} height={20} />
                </IconButton>
              </Stack>

              <Divider sx={{ borderStyle: "dashed" }} />

              {/* <Scrollbar sx={{ flexGrow: 1 }}> */}
              <Scrollbar style={{ flexGrow: 1 }}>
                <Stack spacing={3} sx={{ p: 3 }}>
                  <Stack spacing={1.5}>
                    <IconButton onClick={onToggleMode} disableRipple>
                      <AntSwitch checked={themeMode === "dark"} />
                    </IconButton>
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Presets</Typography>
                    <SettingColorPresets />
                  </Stack>

                  <SettingFullscreen />
                </Stack>
              </Scrollbar>
            </RootStyle>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
