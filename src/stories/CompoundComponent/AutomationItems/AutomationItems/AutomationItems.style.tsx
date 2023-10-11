import { Box, styled } from '@mui/material';

export const RcBox = styled(Box)(({ theme }) => ({
    ".MuiAvatar-root": {
        width: '30px',
        height: '30px',
        marginRight: '8px',
        background: theme.palette.info.main,
        border: 'none !important',
        fontSize: '14px',
        fontWeight: '400',
        borderRadius: '4px',
    },

    ".MuiButtonBase-root": {
        padding: '0 8px',
    },
    // border: `1px dashed ${theme.palette.common.blackshades?.['12p']}`,
}));
