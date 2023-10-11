import { Stack, styled } from '@mui/material';

export const RcStack = styled(Stack)(({ theme }) => ({
  position: 'relative',
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-button': {
      opacity: 1,
    },
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
  },
}));
export const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  transition: theme.transitions.create('opacity'),
  opacity: 0,
}));
