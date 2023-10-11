import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { Box } from '@mui/material';
interface Props {
  leftIcon?: React.ReactElement | React.ReactNode;
  rightIcon?: React.ReactElement | React.ReactNode;
  placeholder?: string;
  bgColor?: string;
}
const CustomizedInputBase: React.FC<Props> = (props) => {
  const { leftIcon, rightIcon, placeholder, bgColor } = props;
  return (
    <Box
      component='form'
      sx={{display: 'flex', alignItems: 'center',}}
    >
      <Box sx={{display: 'flex', alignItems: 'center', flexGrow: 1, flexBasis: 0, background: {bgColor}}}>
        {leftIcon && leftIcon}
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          inputProps={{ 'aria-label': 'search google maps' }}
        />
      </Box>
      {rightIcon && rightIcon}
    </Box>
  );
};
export default CustomizedInputBase;
