import { Box, Stack, useTheme } from '@mui/material'

const CrossIntegrationEgde = () => {
   const theme =  useTheme()
    return (
      <Stack direction="row" alignItems="center">
            <Box sx={{
                width: "40px", minWidth: "40px"   , height: "40px", borderRadius: "100%", background: "text.primary", border: `8px solid ${theme.palette.secondary.main}`
            }} />
            <Box sx={{height : "10px", flexGrow: 1, flexBasis: 0, background :"linear-gradient(180deg, #801692 0%, rgba(128, 22, 146, 0.4) 100%)"  , borderRadius  : "0px 90px 90px 90px"}}/>
           
      </Stack>
     
  )
}

export default CrossIntegrationEgde