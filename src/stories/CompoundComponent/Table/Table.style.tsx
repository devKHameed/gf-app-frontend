import { Paper, styled } from '@mui/material';
export const EnhanceTable = styled(Paper)(({ theme }) => ({
    '.MuiTable-root': {
        borderCollapse: 'separate',
        borderSpacing: '0 15px',
        
        '.MuiTableHead-root': {
            '.MuiTableCell-root': {
                padding: '0 16px',
            },
        },
        
        '.MuiTableCell-root': {
            border: 'none',
            padding: '10px 16px',
            textAlign: 'center',

            '>div': {
                justifyContent: 'center',
            },

            '&:first-child': {
                textAlign: 'left',
                borderRadius: '4px 0 0 4px',

                '>div': {
                    justifyContent: 'flex-start',
                },
                
            },

            '&:last-child': {
                textAlign: 'right',
                borderRadius: '0 4px 4px 0',

                '>div': {
                    justifyContent: 'flex-end',
                },
            },
        },

        '.MuiTableBody-root': {
            '.MuiTableCell-root': {
                background: theme.palette.background.GF5,
            },
        }
    }
}));