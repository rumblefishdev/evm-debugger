import { HelpOutline } from '@mui/icons-material'
import { Stack, styled, Typography } from '@mui/material'

export const StyledSmallPanel = styled(Stack)(() => ({
  overflow: 'auto',
  height: '100%',
  flex: 1,
}))

export const StyledHeading = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
}))

export const StyledListWrapper = styled(Stack)(() => ({
  width: '100%',
  overflow: 'auto',
  height: '100%',
}))

export const StyledBigPanel = styled(Stack)(() => ({
  padding: '8px 16px',
  height: '100%',
  flex: 3,
}))