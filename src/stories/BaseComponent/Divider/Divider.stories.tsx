import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MuiGrid from '@mui/material/Grid';
import { ComponentMeta } from '@storybook/react';
import { styled } from '@mui/material/styles';
export default {
  title: 'Components/Divider',
  component: Divider,
} as ComponentMeta<typeof Divider>;

export const MiddleDividers = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Box sx={{ my: 3, mx: 2 }}>
        <Grid container alignItems='center'>
          <Grid item xs>
            <Typography gutterBottom variant='h4' component='div'>
              Toothbrush
            </Typography>
          </Grid>
          <Grid item>
            <Typography gutterBottom variant='h6' component='div'>
              $4.50
            </Typography>
          </Grid>
        </Grid>
        <Typography color='text.secondary' variant='body2'>
          Pinstriped cornflower blue cotton blouse takes you on a walk to the
          park or just down the hall.
        </Typography>
      </Box>
      <Divider variant='middle' />
      <Box sx={{ m: 2 }}>
        <Typography gutterBottom variant='body1'>
          Select type
        </Typography>
        <Stack direction='row' spacing={1}>
          <Chip label='Extra Soft' />
          <Chip color='primary' label='Soft' />
          <Chip label='Medium' />
          <Chip label='Hard' />
        </Stack>
      </Box>
      <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
        <Button>Add to cart</Button>
      </Box>
    </Box>
  );
};
const VerticalGrid = styled(MuiGrid)(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));
export const VerticalDividerText = () => {
  const content = (
    <div>
      {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id dignissim justo.
   Nulla ut facilisis ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus.
   Sed malesuada lobortis pretium.`}
    </div>
  );

  return (
    <VerticalGrid container>
      <VerticalGrid item xs>
        {content}
      </VerticalGrid>
      <Divider orientation='vertical' flexItem>
        VERTICAL
      </Divider>
      <VerticalGrid item xs>
        {content}
      </VerticalGrid>
    </VerticalGrid>
  );
};
