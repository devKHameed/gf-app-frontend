import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modall from "@mui/material/Modal";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import Scrollbar from "components/Scrollbar";
import * as React from "react";

export default function Modal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modall
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="box-wrap">
          <Stack
            className="modal-header"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Typography variant="subtitle1" component="h2">
              Add User
            </Typography>
            <Box sx={{ lineHeight: "1" }}>
              <CloseIcon />
            </Box>
          </Stack>
          <Box className="modal-body">
            <Scrollbar autoHeight autoHeightMax={`calc(100vh - 210px)`}>
              <Box className="modal-body-wrap">
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
                <Typography variant="subtitle1" component="h2">
                  Add User
                </Typography>
              </Box>
            </Scrollbar>
          </Box>
          <Stack
            className="modal-footer"
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={1.75}
            p={2.5}
          >
            <Button
              color="inherit"
              size="small"
              sx={{
                bgcolor: theme.palette.background.GF10,
                color: theme.palette.background.GF50,
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              color="inherit"
              sx={{
                bgcolor: theme.palette.primary.main,
              }}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Modall>
    </div>
  );
}
