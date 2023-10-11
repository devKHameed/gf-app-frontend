import CheckIcon from "@mui/icons-material/Check";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { AlertProps } from "@mui/material/Alert";
// import Alert from "@mui/material/Alert";

import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { useState } from "react";
import Alert from "./Alert";
export default {
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    children: {
      type: "string",
      defaultValue: "Alert title",
    },
    // severity: {
    //   category: "severity",
    //   defaultValue: "success",
    // },
  },
} as ComponentMeta<typeof Alert>;

export const Default: ComponentStory<typeof Alert> = (props) => (
  <Alert {...props} />
);

export function BasicAlerts1(props: AlertProps) {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity="error" {...props}>
        This is an error alert — check it out!
      </Alert>
      <Alert severity="warning" {...props}>
        This is a warning alert — check it out!
      </Alert>
      <Alert severity="info" {...props}>
        This is an info alert — check it out!
      </Alert>
      <Alert severity="success" {...props}>
        This is a success alert — check it out!
      </Alert>
    </Stack>
  );
}

export function BasicAlerts2() {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert variant="outlined" severity="error">
        This is an error alert — check it out!
      </Alert>
      <Alert variant="outlined" severity="warning">
        This is a warning alert — check it out!
      </Alert>
      <Alert variant="outlined" severity="info">
        This is an info alert — check it out!
      </Alert>
      <Alert variant="outlined" severity="success">
        This is a success alert — check it out!
      </Alert>
    </Stack>
  );
}

export function DescriptionAlerts() {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        This is an error alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity="warning">
        <AlertTitle>Warning</AlertTitle>
        This is a warning alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        This is an info alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        This is a success alert — <strong>check it out!</strong>
      </Alert>
    </Stack>
  );
}
export function ActionAlerts() {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert onClose={() => {}}>This is a success alert — check it out!</Alert>
      <Alert
        action={
          <Button color="inherit" size="small">
            UNDO
          </Button>
        }
      >
        This is a success alert — check it out!
      </Alert>
    </Stack>
  );
}

export function TransitionAlerts() {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Close me!
        </Alert>
      </Collapse>
      <Button
        disabled={open}
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        Re-open
      </Button>
    </Box>
  );
}

export function IconAlerts() {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        This is a success alert — check it out!
      </Alert>
      <Alert
        iconMapping={{
          success: <CheckCircleOutlineIcon fontSize="inherit" />,
        }}
      >
        This is a success alert — check it out!
      </Alert>
      <Alert icon={false} severity="success">
        This is a success alert — check it out!
      </Alert>
    </Stack>
  );
}

export function ColorAlerts() {
  return (
    <Alert severity="success" color="info">
      This is a success alert — check it out!
    </Alert>
  );
}
