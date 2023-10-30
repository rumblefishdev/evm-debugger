import { Stack, styled, Typography } from '@mui/material'

export const StyledSmallPanel = styled(Stack)(() => ({
  width: '100%',
  overflow: 'auto',
  height: '100%',
}))

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  gap: theme.spacing(2),
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  color: theme.palette.rfSecondary,
}))

export const StyledListWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  height: '100%',

  borderTopLeftRadius: '3px',
  borderBottomLeftRadius: '3px',
  borderBottom: `1px solid ${theme.palette.rfLinesLight}`,
  ...theme.customStyles.scrollbar,
}))

export const StyledBigPanel = styled(Stack)(() => ({
  width: '100%',
  maxWidth: '764px',
  height: '100%',
}))
