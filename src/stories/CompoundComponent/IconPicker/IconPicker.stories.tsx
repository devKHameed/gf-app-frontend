import type { ComponentMeta, ComponentStory } from "@storybook/react";
import IconPicker from "components/IconPicker/IconPicker";
export default {
  title: "CompoundComponent/IconPicker",
  component: IconPicker,
} as ComponentMeta<typeof IconPicker>;

const options = [
  { label: "Filled", value: "filled" },
  { label: "Outlined", value: "outlined" },
  { label: "Rounded", value: "rounded" },
  { label: "Two tone", value: "two_tone" },
  { label: "Sharp", value: "sharp" },
];

const icons = options.reduce<Icon[]>((acc, option) => {
  acc.push(
    ...Array(20)
      .fill(null)
      .map(() => ({
        id: "string",
        slug: "string",
        title: "string",
        svg: "string",
        native_ref: "EditOutlined",
        tags: [],
        icon_type: "string",
        category_name: option.label,
        created_by: "string",
        created_at: "string",
        updated_at: "string",
        is_deleted: 0,
      }))
  );

  return acc;
}, []);

export const Item: ComponentStory<typeof IconPicker> = (props) => {
  return (
    <>
      <IconPicker icons={icons} groupKey="category_name" />
    </>
  );
};
