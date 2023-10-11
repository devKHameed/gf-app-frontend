import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { DoughNutChart, GroupChart, LineChart } from 'components/Charts';

export default {
  title: 'CompoundComponent/LineChart',
  component: LineChart,
} as ComponentMeta<typeof LineChart>;

export const BarChart: ComponentStory<typeof LineChart> = (props) => {
  return (
    <>
      <GroupChart />
    </>
  );
};
export const CircalChart: ComponentStory<typeof LineChart> = (props) => {
  return (
    <>
      <DoughNutChart />
    </>
  );
};
export const LinesChart: ComponentStory<typeof LineChart> = (props) => {
  return (
    <>
      <LineChart />
    </>
  );
};
