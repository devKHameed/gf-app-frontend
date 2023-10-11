import { Box, styled } from '@mui/material';
export const CanvasSettingWrap = styled(Box)(({ theme }) => ({
    background: theme.palette.background.GFRightNavBackground,
    padding: '20px',
    borderRadius: '6px',


    '&:after': {
        borderStyle: 'solid',
        borderWidth: '0 10px 10px 10px',
        borderColor: `transparent transparent ${theme.palette.background.GFRightNavBackground} transparent`,
        position: 'absolute',
        left: '50%',
        bottom: '100%',
        transform: 'translate(-50%, 0)'
    },

    '.MuiInputBase-root': {
        background: theme.palette.background.GF5,
        paddingRight: '10px',
    },

    '.MuiTypography-body1': {
        fontSize: '12px',
    },

    '.MuiButtonBase-root': {
        padding: '7px 9px'
    },

    '.MuiDivider-root': {
        margin: '0 -20px 20px',
    },

    '.MuiFormControl-root': {
        '.MuiFormLabel-root': {
            top: '-7px',

            '&.MuiFormLabel-filled': {
                top: '0',
            }
        }
    }
}));
