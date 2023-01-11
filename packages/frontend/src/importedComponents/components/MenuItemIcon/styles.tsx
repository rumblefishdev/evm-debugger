import { Box, Stack, styled, Typography } from '@mui/material'

export const StyledTypography = styled(Typography)<{
  open: boolean | undefined
}>(({ theme, open }) => ({
  color: theme.palette.colorBrand?.primary,
  ...theme.mixins.defaultTransition,
  fontSize: '120%',
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
    color: open ? theme.palette.colorWhite : theme.palette.colorBrand?.primary,
  },
}))

export const StyledStack = styled(Stack)<{ open: boolean | undefined }>(
  ({ theme, open }) => ({
    flexFlow: 'row nowrap',
    cursor: 'default',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      padding: '44px 8px 44px 8px',
      margin: '-44px -8px -44px -8px',
      '&:hover': {
        '& .MuiTypography-root': theme.mixins.hoverTextLightBlue,
      },
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      justifyContent: 'space-between',
      background: open ? theme.palette.colorBrand?.primary : 'unset',
    },
  }),
)
export const StyledIcon = styled(`img`)<{ open: boolean | undefined }>(
  ({ theme, open }) => ({
    position: 'absolute',
    opacity: 0,
    ...theme.mixins.defaultTransition,
    transform: open ? 'rotate(180deg)' : 'rotate(0)',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(1),
    },
  }),
)
export const StyledIconWrapper = styled(Box)(() => ({
  width: '10px',
  position: 'relative',
  height: '7px',
}))
