import { Stack, TextField, Typography, styled } from '@mui/material'

import { StyledListWrapper } from '../styles'

export const StyledCollapse = styled(StyledListWrapper, {
  shouldForwardProp: (prop) => prop !== 'in',
})<{ in: boolean }>(({ in: $in, theme }) => ({
  transition: 'height 0.3s ease',
  marginBottom: theme.spacing(2),
  height: $in ? '30%' : '0px',
  border: 'none',
}))

export const StyledQuickLinksHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  fontSize: '18px',
  color: theme.palette.rfSecondary,
}))

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  // zIndex: 1,
  // top: 0,
  // position: 'sticky',
  // margin: 0,
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'center',
}))

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}))

export const StyledInfo = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 4),
  color: theme.palette.rfDisabledDark,
}))
