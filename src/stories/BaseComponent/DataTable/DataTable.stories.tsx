import type { ComponentMeta, ComponentStory } from "@storybook/react";
import DataTable from "./DataTable";
export default {
  title: "Components/DataTable",
  component: DataTable,
} as ComponentMeta<typeof DataTable>;

export const Default: ComponentStory<typeof DataTable> = (props) => {
  return <DataTable />;
};
