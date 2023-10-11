import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ImageIcon from '@mui/icons-material/Image';
import { Avatar, IconButton, Stack, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { RcProfileCard } from './ProfileUploader.style';
interface Props {
  title?: string;
  imgUrl?: string;
  actionsButtons?: boolean;
}

const ProfileUploader: React.FC<Props> = (props) => {
  const {
    title = 'Profile Photo',
    imgUrl = '/static/images/avatar/1.jpg',
    actionsButtons = true,
  } = props;
  const theme = useTheme();
  return (
    <RcProfileCard
      sx={{
        background: theme.palette.background.GF5,
        borderRadius: '6px',
        '&:hover': {
          background: theme.palette.background.GF10,
        },
      }}
    >
      <CardContent>
        <Typography variant='subtitle1' component='div'>
          {title}
        </Typography>
        <Stack alignItems='center'>
          <Avatar
            alt='Remy Sharp'
            src={imgUrl}
            sx={{ width: '150px', height: '150px', mb: 1.25 }}
          />
          {actionsButtons && (
            <Stack direction='row' alignItems='center' spacing={1}>
              <IconButton size='small' disableRipple>
                <ImageIcon />
              </IconButton>
              <IconButton size='small' disableRipple>
                <CreateOutlinedIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </RcProfileCard>
  );
};

export default ProfileUploader;
