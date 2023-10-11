import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { CardMedia, IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import React, { FC, ReactElement, ReactNode } from 'react';
import { Image, RcStack } from './ImageCard.style';
interface IImageCard {
  icon?: ReactElement | ReactNode;
  actions?: ReactElement | ReactNode;
  actionIcon?: ReactElement | ReactNode;
  thumnailUrl?: string;
}
export const GetActionsButton = ({ actionIcon, theme }: any) => {
  return (
    <IconButton
      size='small'
      color='inherit'
      aria-label='open drawer'
      sx={{
        color: 'background.GF60',
        borderRadius: '6px',
        background: theme.palette.background.GFRightNavBackground,
        ':hover': { background: theme.palette.background.GFRightNavForeground },
      }}
    >
      {actionIcon}
    </IconButton>
  );
};
const ImageCard: FC<IImageCard> = (props) => {
  const theme = useTheme();
  const {
    icon,
    actions,
    thumnailUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
  } = props;
  return (
    <RcStack>
      <CardMedia
        image={thumnailUrl}
        component='img'
        height='194'
        alt='Paella dish'
      />
      <Image className='MuiImageBackdrop-button'>
        {icon && (
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='open drawer'
            sx={{
              background: theme.palette.background.paper,
              color: 'background.GF60',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              zIndex: '4',
              ':hover': { background: theme.palette.background.GFPaper },
            }}
          >
            {icon}
          </IconButton>
        )}
      </Image>
      <Image className='MuiImageBackdrop-button'>
        <Stack
          direction='row'
          gap={0.75}
          sx={{ position: 'absolute', right: '20px', bottom: '20px' }}
        >
          {actions ? (
            <React.Fragment>{actions}</React.Fragment>
          ) : (
            <React.Fragment>
              <GetActionsButton
                actionIcon={
                  <CreateIcon sx={{ width: '20px', height: '20px' }} />
                }
                theme={theme}
              />
              <GetActionsButton
                actionIcon={
                  <DeleteIcon sx={{ width: '20px', height: '20px' }} />
                }
                theme={theme}
              />
            </React.Fragment>
          )}
        </Stack>
      </Image>
    </RcStack>
  );
};

export default ImageCard;
