import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { dataStack, dataStackTwo } from 'data';
import AutomationItems from './AutomationItems';

export default {
  title: 'CompoundComponent/AutomationItems',
  component: AutomationItems,
} as ComponentMeta<typeof AutomationItems>;
const ActionButtons = () => {
  return (
    <>
      <IconButton aria-label='upload picture' component='label' disableRipple>
        <DeleteIcon />
      </IconButton>
      <IconButton aria-label='upload picture' component='label' disableRipple>
        <SettingsIcon />
      </IconButton>
    </>
  );
};
export const Item: ComponentStory<typeof AutomationItems> = (props) => {
  return (
    <Stack gap={2}>
      <AutomationItems
        data={dataStackTwo}
        directionStyle={{
          direction: 'row-reverse',
          justifyContent: 'space-between',
        }}
        actionComponent={
          <Stack direction='row' alignItems={'center'}>
            <Typography component='div' variant='subtitle1'>
              Automation Title
            </Typography>
            <ActionButtons />
          </Stack>
        }
      />
      <AutomationItems
        data={dataStack}
        actionComponent={
          <Stack
            direction='row'
            alignItems={'center'}
            justifyContent={'space-between'}
            mb={1.25}
          >
            <Typography component='div' variant='subtitle1'>
              Automation Title
            </Typography>

            <Box>
              <ActionButtons />
            </Box>
          </Stack>
        }
      />
    </Stack>
  );
};
