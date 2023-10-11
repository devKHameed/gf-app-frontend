import EmailOutlined from "@mui/icons-material/EmailOutlined";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import PurchaseToaster from "./PurchaseToaster";

export default {
  title: "CompoundComponent/PurchaseToaster",
  component: PurchaseToaster,
} as ComponentMeta<typeof PurchaseToaster>;

export const Item: ComponentStory<typeof PurchaseToaster> = (props) => {
  return (
    <PurchaseToaster
      title="Purchase Order Submitted"
      subtitle="Sent to monkey@climbhill.com"
      icon={<EmailOutlined />}
      timestamp="2023-02-14T04:32:57+05:00"
    />
  );
};
