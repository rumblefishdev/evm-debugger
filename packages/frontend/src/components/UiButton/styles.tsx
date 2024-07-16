import { Button, styled } from '@mui/material';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import WestRoundedIcon from '@mui/icons-material/WestRounded';

export const ArrowRight = styled(EastRoundedIcon)(({ theme }) => ({
  path: {
    color: 'rgb(255,255,255,1)',
  },
}));
export const ArrowLeft = styled(WestRoundedIcon)(({ theme }) => ({
  path: {
    color: 'rgb(255,255,255,1)',
  },
}));
export const StyledButton = styled(Button)(({ theme, fullWidth }) => ({
  '&.MuiButton-root': {
    transition: 'all 0s !important',
  },
  fontFamily: 'Satoshi',
  fontWeight: '600',
  lineHeight: '175%',
  letterSpacing: '-0.1px',
  textTransform: 'none',
  borderRadius: '69px',
  whiteSpace: 'nowrap',
  width: 'min-content',
  '&.MuiButton-wide': {
    width: 'auto',
  },

  padding: '0px',
  ...theme.mixins.defaultTransition,
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

  '&.MuiButton-primary': {
    '*': {
      color: '#FBFCFD',
    },

    boxShadow: '0px 8px 24px 0px rgba(48, 98, 212, 0.25)',
    '& .MuiStack-root': {
      width: '100%',
      background: '#3062D4',
      borderRadius: '69px',
      transition: 'background 0.3s',
      '&:hover': { background: '#6792F4' },
    },
  },
  '&.MuiButton-flat': {
    background: 'rgb(255,255,255,0.15)',
    boxShadow: `0px 8px 24px 0px rgb(255,255,255,0.1)`,
  },

  '&.MuiButton-icon': {
    minWidth: 'auto',
    background: 'transparent',
    '& .MuiStack-root': {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(1),
      alignItems: 'center',
      padding: theme.spacing(0),
      '& .MuiTypography-root': {
        padding: theme.spacing(0),
        color: 'currentColor',
      },
    },
  },
  '&.MuiButton-link': {
    background: 'transparent',
    '& .MuiStack-root': {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(1),
      alignItems: 'center',
      padding: theme.spacing(0),
      '& .MuiTypography-root': {
        color: 'rgb(255,255,255,1)',
      },
    },
  },
}));
