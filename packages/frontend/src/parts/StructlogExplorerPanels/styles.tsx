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

export const StyledDisabledBytecode = styled(Stack)(() => ({
  width: '100%',
  textAlign: 'center',
  padding: '8px 16px',
  justifyContent: 'center',
  height: '100%',
  flexDirection: 'column',
  background: 'rgba(0, 0, 0, 0.38)',
  alignItems: 'center',
}))

export const StyledCounter = styled(Typography)(() => ({
  width: '64px',
  textAlign: 'right',
  marginRight: '24px',
}))

export const StyledType = styled(Typography)(() => ({
  width: '152px',
  marginRight: '24px',
}))

export const StyledOpcodeDescriptionIcon = styled(HelpOutline)(() => ({
  width: '12px',
  marginLeft: '4px',
  height: '12px',
}))
