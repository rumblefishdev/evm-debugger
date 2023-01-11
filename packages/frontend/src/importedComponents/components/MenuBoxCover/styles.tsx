import { styled, Typography } from '@mui/material'

import { MenuItem } from '../MenuItem'

export const StyledText = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre-line',
  textAlign: 'center',
  marginTop: theme.spacing(3),
}))

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  marginTop: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': theme.mixins.hoverTextLightBlue,
}))
