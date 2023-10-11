import { Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import GoogleTaskIcon from 'assets/svg/GoogleTaskIcon'

const FlowEdges = () => {
  return (
    <Stack direction='row' gap={2.5} alignItems="center">
      <Box sx={{width: '110px'  , height: '110px'  , borderRadius: '100%'  , border : "1px solid red" , padding: '14px'  , background : 'white'}}>
          <GoogleTaskIcon/>

      </Box>
          <Box>
            <Typography component='div' variant='subtitle1' color='text.primary'>Google Tasks</Typography>
            <Typography component='div' variant='body2'>Guif Wizard</Typography>
          </Box>
      </Stack>
  )
}

export default FlowEdges