import { Button, styled } from '@mui/material'

export const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 'unset',
  lineHeight: '120%',
  letterSpacing: '0.05em',
  fontWeight: '600',
  fontFamily: 'Rajdhani',
  borderRadius: '32px',
  ...theme.mixins.defaultTransition,
  '&.MuiButton-text': {
    padding: 'unset !important',
    color: theme.palette.colorLink,
    '&:hover': {
      backgroundColor: 'unset',
    },
  },
  '&.MuiButton-sizeSmall': {
    padding: theme.spacing(1, 2),
    fontSize: '0.875rem',
  },
  '&.MuiButton-sizeMedium': {
    padding: theme.spacing(1.25, 4),
    fontSize: '1rem',
  },
  '&.MuiButton-sizeLarge': {
    padding: theme.spacing(2.25, 5),
    fontSize: '1rem',
  },
  '&.MuiButton-outlined': {
    color: theme.palette.colorLink,
    borderColor: theme.palette.colorLines,
    '&:hover': {
      ...theme.mixins.hoverTextLightBlue,
      borderColor: theme.palette.colorLink,
      backgroundColor: 'inherit',
    },
  },
  '&.MuiButton-contained': {
    color: theme.palette.colorWhite,
    boxShadow: 'none',
    backgroundColor: theme.palette.colorLink,

    '&:hover': {
      backgroundColor: theme.palette.colorBrand?.primary,
    },
  },
}))
