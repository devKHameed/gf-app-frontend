import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { RcStack } from './FileUploader.style';
interface Props {
  fileSize?: string;
  fileName?: string;
  leftIcon?: React.ReactElement | React.ReactNode;
}
const UploadedItems: React.FC<Props> = (props) => {
  const {
    fileSize = '100KB',
    fileName = 'document_file_name.pdf',
    leftIcon = <ImageIcon />,
  } = props;
  const theme = useTheme();
  return (
    <RcStack
      direction='row'
      alignItems='center'
      borderRadius={'4px'}
      py={1.25}
      px={2}
    >
      <RcStack direction='row' alignItems='center' flexGrow={1} flexBasis={0}>
        <IconButton
          color='primary'
          aria-label='upload picture'
          component='label'
          disableRipple
          sx={{
            background: theme.palette.primary.shades?.['12p'],
            marginRight: 1,
          }}
        >
          {leftIcon}
        </IconButton>
        <Stack>
          <Typography component='div' variant='subtitle1'>
            {fileName}
          </Typography>
          <Typography component='div' variant='body2'>
            {fileSize}
          </Typography>
        </Stack>
      </RcStack>
      <Box>
        <IconButton aria-label='upload picture' component='label' disableRipple>
          <DeleteIcon />
        </IconButton>
        <IconButton aria-label='upload picture' component='label' disableRipple>
          <EditIcon />
        </IconButton>
      </Box>
    </RcStack>
  );
};

export default UploadedItems;
