import { Button, styled } from '@mui/material'

/* eslint-disable */
export const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: 'Rajdhani',
  fontWeight: '600',
  lineHeight: '120%',
  letterSpacing: '0.05em',
  textTransform: 'none',
  borderRadius: '32px',
  minWidth: 'unset',
  ...theme.mixins.defaultTransition,
  '&.MuiButton-contained': {
    color: theme.palette.primaryTextButtonColor,
    backgroundColor: theme.palette.colorLink,
    boxShadow:
      theme.palette.type === 'dark' || theme.palette.type === 'navy'
        ? '0px 8px 24px rgba(255, 255, 255, 0.15)'
        : 'none',
    border:
      theme.palette.type === 'dark' || theme.palette.type === 'navy'
        ? '4px solid rgba(255, 255, 255, 0.25)'
        : 'none',
    backgroundClip:
      (theme.palette.type === 'dark' || theme.palette.type === 'navy') &&
      'padding-box',
    borderRadius: theme.palette.type === 'dark' ? '16px' : 'none',
    '&:hover': {
      backgroundColor: theme.palette.primaryButtonHoverBgColor,
    },
  },
  '&.MuiButton-outlined': {
    color: theme.palette.colorLink,
    borderColor: theme.palette.colorLines,
    '&:hover': {
      ...theme.mixins.hoverTextLightBlue,
      backgroundColor: 'inherit',
      borderColor: theme.palette.colorLink,
    },
  },
  '&.MuiButton-text': {
    color: theme.palette.colorLink,
    padding: 'unset !important',
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
}));
