import { Card, styled } from '@mui/material';

export const RcProfileCard = styled(Card)(({ theme }) => ({
  '&:hover': {
    background: theme.palette.gfGrey?.['GF75'],
  },
}));
