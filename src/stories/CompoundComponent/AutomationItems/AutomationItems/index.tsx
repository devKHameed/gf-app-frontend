import { IconButton, Stack, StackProps, Typography } from '@mui/material';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { RcBox } from './AutomationItems.style';
interface Props {
  directionStyle?: StackProps;
  actionComponent?: React.ReactElement | React.ReactNode;
  data?: any[];
}
const AutomationAppsItems: React.FC<Props> = (props) => {
  const { actionComponent, data = [], directionStyle = {} } = props;
  const theme = useTheme();
  return (
    <RcBox>
      <Stack
        px={3}
        py={1.75}
        borderRadius='6px'
        bgcolor={theme.palette.background.GF5}
        sx={{
          '&:hover': {
            background: theme.palette.background.GFRightNavBackground,
          },
        }}
        {...directionStyle}
      >
        {actionComponent}
        <Stack direction={'row'}>
          {data?.map((ele: any) => {
            return (
              <Stack direction='row'>
                <AvatarGroup max={ele.max} variant='rounded' spacing={0}>
                  {ele?.runingModule?.map((item: any) => (
                    <Avatar variant='rounded'>{item}</Avatar>
                  ))}
                </AvatarGroup>
                <IconButton disableRipple>
                  <Typography variant='body2'>On create</Typography>
                  <ArrowForwardIosIcon
                    sx={{ width: '12px', marginLeft: '4px' }}
                  />
                </IconButton>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </RcBox>
  );
};

export default AutomationAppsItems;
