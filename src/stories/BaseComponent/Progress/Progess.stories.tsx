import * as React from "react";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { ComponentMeta } from "@storybook/react";
import { CircularProgress } from "@mui/material";

export default {
  title: "Components/Progress",
} as ComponentMeta<typeof LinearProgress>;

export const ProgressLinear = () => {
  return (
    <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
      <LinearProgress />
      <LinearProgress color="secondary" />
      <LinearProgress color="success" />
      <LinearProgress color="inherit" />
      <LinearProgress variant="buffer" />
    </Stack>
  );
};
export const CircularColor = () => {
  return (
    <Stack sx={{ color: "grey.500" }} spacing={2} direction="row">
      <CircularProgress />
      <CircularProgress color="secondary" />
      <CircularProgress color="success" />
      <CircularProgress color="inherit" />
    </Stack>
  );
};
