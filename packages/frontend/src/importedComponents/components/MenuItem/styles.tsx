import { styled, Typography } from '@mui/material'

export const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '120%',
  cursor: 'pointer',
  color: theme.palette.colorBrand?.primary,
  '&:hover': theme.mixins.hoverTextLightBlue,
  [theme.breakpoints.up('md')]: {
    padding: '44px 0px 44px 0px',
    margin: '-44px 0px -44px 0px',
  },
}))
