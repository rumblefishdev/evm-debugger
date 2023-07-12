import { Box, Stack, styled, Typography } from '@mui/material'

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.colorBrand?.primary,
}))

export const StyledStack = styled(Stack)(({ theme }) => ({
  justifyContent: 'flex-start',
  flexFlow: 'row nowrap',
  cursor: 'pointer',
  alignItems: 'center',
  '&:hover': {
    '& .MuiTypography-root': theme.mixins.hoverTextLightBlue,
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    justifyContent: 'space-between',
  },
}))
export const StyledIcon = styled(`img`)(({ theme }) => ({
  transform: 'rotate(-90deg)',
  position: 'absolute',
  opacity: 0,
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(1),
  },
}))
export const StyledIconWrapper = styled(Box)(() => ({
  width: '10px',
  position: 'relative',
  height: '7px !important',
}))
