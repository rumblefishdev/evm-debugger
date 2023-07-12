import { styled, Typography } from '@mui/material'

import { MenuItem } from '../MenuItem'

export const StyledText = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre-line',
  textAlign: 'center',
  paddingLeft: '10px !important',
  [theme.breakpoints.down('md')]: {
    paddingLeft: '8px !important',
    marginTop: theme.spacing(0),
  },
  marginTop: theme.spacing(1),
}))

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  paddingLeft: '10px !important',
  fontSize: '100%',
  cursor: 'pointer',
  '&:hover': theme.mixins.hoverTextLightBlue,
  [theme.breakpoints.down('md')]: {
    paddingLeft: '8px !important',
  },
}))
