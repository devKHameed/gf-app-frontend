import type { ComponentMeta, ComponentStory } from '@storybook/react';
import EnhancedTable from './Table';

export const Table: ComponentStory<typeof EnhancedTable> = (props) => {
  return (
    <>
      <EnhancedTable />
    </>
  );
};
export default {
  title: 'CompoundComponent/EnhancedTable',
  component: EnhancedTable,
} as ComponentMeta<typeof EnhancedTable>;
