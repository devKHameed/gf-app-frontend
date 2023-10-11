import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GetActionsButton } from 'components/ImageCard';
import * as React from 'react';
import {
  Image,
  ImageBackdrop,
  ImageSrc,
  RcAvatar,
} from './ProfileEditor.style';
interface Props {
  imgUrl?: string;
}

const ProfileEditor: React.FC<Props> = (props) => {
  const {
    imgUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
  } = props;
  const theme = useTheme();
  return (
    <RcAvatar sx={{ width: '100px', height: '100px' }}>
      <ImageSrc
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      />
      <ImageBackdrop className='MuiImageBackdrop-root' />
      <Image className='MuiImageBackdrop-button'>
        <Stack direction={'row'} spacing={0.75}>
          <GetActionsButton
            actionIcon={
              <ModeEditOutlineOutlinedIcon
                sx={{ width: '20px', height: '20px' }}
              />
            }
            theme={theme}
          />
          <GetActionsButton
            actionIcon={
              <DeleteOutlineOutlinedIcon
                sx={{ width: '20px', height: '20px' }}
              />
            }
            theme={theme}
          />
        </Stack>
      </Image>
    </RcAvatar>
  );
};

export default ProfileEditor;
