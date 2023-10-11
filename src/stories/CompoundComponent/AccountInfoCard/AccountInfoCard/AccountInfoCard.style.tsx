import { Card, styled } from '@mui/material';
export const InfoCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.GFRightNavForeground,
  '&:hover': {
    background: theme.palette.background.GFRightNavBackground
  },
}));
