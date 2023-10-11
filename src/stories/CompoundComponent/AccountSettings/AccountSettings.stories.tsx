import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { AccountSettingsComponent } from './AccountSetting';

export const AccountSetting: ComponentStory<typeof AccountSettingsComponent> = (
  props
) => {
  return (
    <>
      <AccountSettingsComponent />
    </>
  );
};
export default {
  title: 'CompoundComponent/AccountSettingsComponent',
  component: AccountSettingsComponent,
} as ComponentMeta<typeof AccountSettingsComponent>;
