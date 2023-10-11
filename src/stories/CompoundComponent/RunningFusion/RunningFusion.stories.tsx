import { Button } from '@mui/material';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import RunFusion from 'components/RunFusion/RunFusion';

export default {
  title: 'CompoundComponent/RunFusion',
  component: RunFusion,
} as ComponentMeta<typeof RunFusion>;

export const RunningTest: ComponentStory<typeof Button> = (props) => {
  return (
    <>
      <RunFusion />
    </>
  );
};
