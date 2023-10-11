import { Card, styled } from '@mui/material';

export const RcPostCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.GFRightNavBackground,
  "&:hover": {
    background: theme.palette.background.GFRightNavForeground
  }
}));
