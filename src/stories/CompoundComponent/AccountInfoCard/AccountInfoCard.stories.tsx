import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { accountinfoData, accountinfoData1, accountinfoDataTwo } from "data";
import InfoCard from "./AccountInfoCard/AccountInfoCard";
export default {
  title: "CompoundComponent/InfoCard",
  component: InfoCard,
} as ComponentMeta<typeof InfoCard>;

export const Item: ComponentStory<typeof InfoCard> = (props) => {
  return (
    <>
      <InfoCard
        headerRightIcon={<AddBoxTwoToneIcon sx={{ color: "grey.500" }} />}
        data={accountinfoData}
      />
      <InfoCard
        headerRightIcon={<CreateOutlinedIcon sx={{ color: "grey.500" }} />}
        title={"My App"}
        data={accountinfoDataTwo}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."
        }
        headerIcon={<AddBoxTwoToneIcon sx={{ color: "grey.500" }} />}
      />
      <InfoCard
        title="Permission Level"
        data={accountinfoData1}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."
        }
      />
    </>
  );
};
