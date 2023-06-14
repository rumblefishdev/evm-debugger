import { MenuItem, Select, Stack, styled, TextField, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(2),
  flexDirection: 'column',
  display: 'flex',
  alignItems: 'center',
}))
export const StyledInputWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(1),
  flexDirection: 'column',
}))
export const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '48px',
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.colorWhite,
      border: '1px solid',
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.colorBrand.secondary,
      '&:hover': {
        borderColor: theme.palette.colorBrand.secondary,
      },
    },
    '& input': {
      padding: theme.spacing(2, 3, 2, 3),
    },
    '& fieldset': {
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
}))
export const StyledInputLabel = styled(Typography)(({ theme }) => ({
  textTransform: 'uppercase',
  textAlign: 'left',
  opacity: 0.5,
  lineHeight: '100%',
  fontWeight: 600,
  fontSize: '12px',
  fontFamily: 'Rajdhani',
  color: theme.palette.colorWhite,
}))
export const StyledErrorLabel = styled(StyledInputLabel)(({ theme }) => ({
  color: theme.palette.colorBrand.secondary,
}))

// Todo: style select to fit the theme

export const StyledSelect = styled(Select)(({ theme }) => ({
  letterSpacing: '-0.01em',

  height: '48px',
  fontWeight: 650,
  // change border color
  fontVariationSettings: 'slnt 0',
  fontSize: '14px',
  fontFamily: 'Inter',
  color: theme.palette.colorWhite,
  '.MuiSvgIcon-root ': {
    fill: 'white !important',
  },
  '&.MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },

    '&.Mui-focused fieldset': {
      borderColor: theme.palette.colorWhite,
      border: '1px solid',
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.colorBrand.secondary,
      '&:hover': {
        borderColor: theme.palette.colorBrand.secondary,
      },
    },
    '& input': {
      padding: theme.spacing(2, 3, 2, 3),
    },
    '& fieldset': {
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },

  '& .MuiPopover-paper': {
    color: theme.palette.text.primary,
    borderRadius: '16px',
    border: `1px solid ${theme.palette.colorLines}`,
    backgroundColor: theme.palette.colorBrand.primary,
  },

  // // override paper styles
  // '& .MuiPaper-root': {
  //   borderRadius: "16px",
  //   border: `1px solid ${theme.palette.colorLines}`,
  //   backgroundColor: theme.palette.colorBrand.primary,
  // },
}))

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  letterSpacing: '-0.01em',
  fontWeight: 300,
  fontVariationSettings: 'slnt 0',
  fontSize: '14px',
  fontFamily: 'Inter',
  color: theme.palette.colorWhite,
}))
