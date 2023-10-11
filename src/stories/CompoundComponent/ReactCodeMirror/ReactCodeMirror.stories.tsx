import { json } from '@codemirror/lang-json';
import {
  Card,
  CardContent,
  InputLabel,
  CardActions,
  Button,
  Stack,
  useTheme,
  Typography,
} from '@mui/material';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import ReactCodeMirror from '@uiw/react-codemirror';

export default {
  title: 'CompoundComponent/ReactCodeMirror',
  component: ReactCodeMirror,
} as ComponentMeta<typeof ReactCodeMirror>;

export const ReactCode: ComponentStory<typeof ReactCodeMirror> = (props) => {
  const theme = useTheme();
  return (
    <Card>
      <CardContent sx={{background: theme.palette.background.GFRightNavBackground, p: 2.5}}>
        <Stack spacing={1} >
          <Typography variant='subtitle1'>Code Edit</Typography>
          <ReactCodeMirror
            value="console.log('hello world!');"
            height='200px'
            theme='dark'
            extensions={[json()]}
            // onChange={onChange}
          />
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button variant='outlined' color='inherit'>
              Cancel
            </Button>
            <Button
              color='inherit'
              sx={{
                bgcolor: theme.palette.primary.main,
              }}
            >
              Save Changes
            </Button>
          </CardActions>
        </Stack>
      </CardContent>
    </Card>
  );
};
