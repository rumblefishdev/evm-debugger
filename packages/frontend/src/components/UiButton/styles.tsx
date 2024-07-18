import { Button, styled } from '@mui/material'
import EastRoundedIcon from '@mui/icons-material/EastRounded'
import WestRoundedIcon from '@mui/icons-material/WestRounded'

export const ArrowRight = styled(EastRoundedIcon)(() => ({
  path: {
    color: 'rgb(255,255,255,1)',
  },
}))
export const ArrowLeft = styled(WestRoundedIcon)(() => ({
  path: {
    color: 'rgb(255,255,255,1)',
  },
}))
export const StyledButton = styled(Button)(({ theme, fullWidth }) => ({
  width: 'min-content',
  whiteSpace: 'nowrap',
  textTransform: 'none',
  padding: '0px',
  lineHeight: '175%',
  letterSpacing: '-0.1px',
  fontWeight: '600',
  fontFamily: 'Satoshi',
  borderRadius: '69px',
  '&.MuiButton-wide': {
    width: 'auto',
  },

  '&.MuiButton-root': {
    transition: 'all 0s !important',
  },
  ...theme.mixins.defaultTransition,
  '&.MuiButton-primary': {
    boxShadow: '0px 8px 24px 0px rgba(48, 98, 212, 0.25)',

    '*': {
      color: '#FBFCFD',
    },
    '& .MuiStack-root': {
      width: '100%',
      transition: 'background 0.3s',
      borderRadius: '69px',
      background: '#3062D4',
      '&:hover': { background: '#6792F4' },
    },
  },

  '&.MuiButton-link': {
    background: 'transparent',
    '& .MuiStack-root': {
      padding: theme.spacing(0),
      gap: theme.spacing(1),
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      '& .MuiTypography-root': {
        color: 'rgb(255,255,255,1)',
      },
    },
  },
  '&.MuiButton-icon': {
    minWidth: 'auto',
    background: 'transparent',
    '& .MuiStack-root': {
      padding: theme.spacing(0),
      gap: theme.spacing(1),
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      '& .MuiTypography-root': {
        padding: theme.spacing(0),
        color: 'currentColor',
      },
    },
  },

  '&.MuiButton-flat': {
    boxShadow: `0px 8px 24px 0px rgb(255,255,255,0.1)`,
    background: 'rgb(255,255,255,0.15)',
  },
  '& .MuiStack-root': {
    padding: `${theme.utils.fluidSize({
      minSize: 8,
      maxSize: 10,
    })} ${theme.utils.fluidSize({ minSize: 20, maxSize: 32 })}`,
    borderRadius: '69px',
    [theme.breakpoints.down('md')]: {
      padding: '8px 20px',
    },
    [theme.breakpoints.up('xl')]: {
      padding: '10px 32px',
    },
    ...(fullWidth && { width: '100%' }),
  },
}))
