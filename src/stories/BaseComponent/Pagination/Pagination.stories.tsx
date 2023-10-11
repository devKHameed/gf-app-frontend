import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import BasicPagination from "./Pagination";

export default {
  title: "Components/Pagination",
  component: BasicPagination,
  argTypes: {
    count: {
      type: "number",
      category: "count",
      defaultValue: 20,
    },
    hideNextButton: {
      type: "boolean",
      defaultValue: false,
    },
    hidePrevButton: {
      type: "boolean",
      defaultValue: false,
    },
    variant: {
      options: ["text", "outlined"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    variant: "outlined",
  },
} as ComponentMeta<typeof BasicPagination>;

export const PaginationRounded: ComponentStory<typeof BasicPagination> = (
  props
) => {
  return (
    <Stack spacing={2}>
      <Pagination count={10} shape="rounded" {...props} />
      <Pagination count={10} variant="outlined" shape="rounded" {...props} />
    </Stack>
  );
};

export const Default: ComponentStory<typeof BasicPagination> = (props) => {
  return <BasicPagination {...props} />;
};
export const PaginationOutlined: ComponentStory<typeof BasicPagination> = (
  props
) => {
  return (
    <Stack spacing={2}>
      <Pagination count={10} variant="outlined" {...props} />
      <Pagination count={10} variant="outlined" color="primary" {...props} />
      <Pagination count={10} variant="outlined" color="secondary" {...props} />
      <Pagination count={10} variant="outlined" disabled {...props} />
    </Stack>
  );
};
