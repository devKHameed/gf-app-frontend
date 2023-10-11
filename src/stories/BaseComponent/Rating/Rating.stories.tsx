import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { ComponentMeta } from '@storybook/react';
import Select from 'theme/overrides/Select';
import SelectInput from '@mui/material/Select/SelectInput';

export default {
  title: 'Components/Rating',
  component: Rating,
} as ComponentMeta<typeof Rating>;

export const BasicRating = () => {
  const [value, setValue] = React.useState<number | null>(2);

  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Typography component='legend'>Controlled</Typography>
      <Rating
        name='simple-controlled'
        value={value}
        size="small"
        precision={0.5}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
      <Rating
        name='simple-controlled'
        value={value}
        size="small"
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
      <Typography component='legend'>Read only</Typography>
      <Rating name='read-only' value={value} readOnly />
      <Typography component='legend'>Disabled</Typography>
      <Rating name='disabled' value={value} disabled />
      <Typography component='legend'>No rating given</Typography>
      <Rating name='no-value' value={null} />
    </Box>
  );
};
