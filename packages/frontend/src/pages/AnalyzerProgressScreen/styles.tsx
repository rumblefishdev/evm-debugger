import { Stack, styled, Typography } from '@mui/material'

export const StyledMainPanel = styled(Stack)(() => ({
  width: '524px',
  position: 'relative',
  justifyContent: 'space-between',
  height: '100%',
  flexDirection: 'column',
}))

export const StyledHeadline = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfText,
}))
export const StyledHeadlineCaption = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfBrandSecondary,
}))

export const StyledImage = styled('img')(() => ({
  zIndex: -1,
  width: 'auto',
  top: '220px',
  position: 'absolute',
  left: '128px',
  height: '756px',
}))
