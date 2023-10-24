import { Stack, Button, styled, Typography } from '@mui/material'

export const StyledSmallPanel = styled(Stack)(() => ({
  width: '100%',
  overflow: 'auto',
  height: '100%',
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  position: 'relative',
  marginBottom: theme.spacing(6),
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

export const StyledButton = styled(Button)(({ theme }) => ({
  whiteSpace: 'nowrap',
  transform: `translate(${theme.spacing(2)}, -50%)`,
  top: '50%',
  position: 'absolute',
}))
