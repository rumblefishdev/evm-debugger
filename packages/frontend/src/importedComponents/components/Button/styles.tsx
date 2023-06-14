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
    color: theme.palette.primaryTextButtonColor,
    boxShadow: theme.palette.type === 'dark' || theme.palette.type === 'navy' ? '0px 8px 24px rgba(255, 255, 255, 0.15)' : 'none',
    borderRadius: theme.palette.type === 'dark' ? '16px' : 'none',
    border: theme.palette.type === 'dark' || theme.palette.type === 'navy' ? '4px solid rgba(255, 255, 255, 0.25)' : 'none',
    backgroundColor: theme.palette.colorLink,
    backgroundClip: (theme.palette.type === 'dark' || theme.palette.type === 'navy') && 'padding-box',
    '&:hover': {
      backgroundColor: theme.palette.primaryButtonHoverBgColor,
    },
  },
}))
