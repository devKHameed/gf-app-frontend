import type { ComponentMeta, ComponentStory } from '@storybook/react';
import ImageCard from 'components/ImageCard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';

export default {
  title: 'CompoundComponent/GalleryMedia',
  component: ImageCard,
} as ComponentMeta<typeof ImageCard>;

export const Media: ComponentStory<typeof ImageCard> = (props) => {
  return (
    <>
      <Typography component='div' variant='subtitle1'>
        Video
      </Typography>
      <ImageCard icon={<PlayArrowIcon />} />
      <Typography component='div' variant='subtitle1'>
        Image
      </Typography>
      <ImageCard icon={<AddIcon />} />
    </>
  );
};
