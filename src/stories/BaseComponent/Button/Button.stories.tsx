import BtnUnstyled from "@mui/base/ButtonUnstyled";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AlarmIcon from "@mui/icons-material/Alarm";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import Button from "./Button";
export default {
  title: "Components/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

export const Default: ComponentStory<typeof Button> = (props) => {
  const { children = "Button", ...rest } = props;
  return <Button {...rest}>{children}</Button>;
};
export const VarintButtons: ComponentStory<typeof Button> = (props) => {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Stack>
  );
};

export const Disabled: ComponentStory<typeof Button> = (props) => (
  <Stack spacing={2} direction="row">
    <Button disabled variant="text">
      Text
    </Button>
    <Button disabled variant="contained">
      Contained
    </Button>
    <Button disabled variant="outlined">
      Outlined
    </Button>
  </Stack>
);

export const SizesButtons: ComponentStory<typeof Button> = (props) => (
  <Box sx={{ "& button": { m: 1 } }}>
    <div>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
    <div>
      <Button variant="outlined" size="small">
        Small
      </Button>
      <Button variant="outlined" size="medium">
        Medium
      </Button>
      <Button variant="outlined" size="large">
        Large
      </Button>
    </div>
    <div>
      <Button variant="contained" size="small">
        Small
      </Button>
      <Button variant="contained" size="medium">
        Medium
      </Button>
      <Button variant="contained" size="large">
        Large
      </Button>
    </div>
  </Box>
);

export const ButtonsIcons: ComponentStory<typeof BtnUnstyled> = (props) => (
  <Stack direction={"row"} spacing={3}>
    <Button variant="outlined" startIcon={<DeleteIcon />}>
      Delete
    </Button>
    <Button variant="contained" endIcon={<SendIcon />}>
      Send
    </Button>
  </Stack>
);

export const IconsOnlyButtons: ComponentStory<typeof BtnUnstyled> = (props) => (
  <Stack direction="row" spacing={1}>
    <IconButton aria-label="delete">
      <DeleteIcon />
    </IconButton>
    <IconButton aria-label="delete" disabled color="primary">
      <DeleteIcon />
    </IconButton>
    <IconButton color="secondary" aria-label="add an alarm">
      <AlarmIcon />
    </IconButton>
    <IconButton color="primary" aria-label="add to shopping cart">
      <AddShoppingCartIcon />
    </IconButton>
  </Stack>
);
Default.argTypes = {};
export const ButtonUnstyled: ComponentStory<typeof BtnUnstyled> = (props) => (
  <BtnUnstyled {...props}>Hello</BtnUnstyled>
);
