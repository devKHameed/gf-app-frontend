import GrainIcon from "@mui/icons-material/Grain";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>;

export const Default: ComponentStory<typeof Breadcrumbs> = (props) => (
  <Stack spacing={3}>
    <Breadcrumbs maxItems={2} aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href="#">
        Home
      </Link>
      <Link underline="hover" color="inherit" href="#">
        Catalog
      </Link>
      <Link underline="hover" color="inherit" href="#">
        Accessories
      </Link>
      <Link underline="hover" color="inherit" href="#">
        New Collection
      </Link>
      <Typography color="text.primary">Belts</Typography>
    </Breadcrumbs>

    <Breadcrumbs aria-label="breadcrumb">
      <Link
        underline="hover"
        sx={{ display: "flex", alignItems: "center" }}
        color="inherit"
        href="/"
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        MUI
      </Link>
      <Link
        underline="hover"
        sx={{ display: "flex", alignItems: "center" }}
        color="inherit"
        href="/material-ui/getting-started/installation/"
      >
        <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Core
      </Link>
      <Typography
        sx={{ display: "flex", alignItems: "center" }}
        color="text.primary"
      >
        <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Breadcrumb
      </Typography>
    </Breadcrumbs>
  </Stack>
);
