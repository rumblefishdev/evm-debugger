import { Card, Stack, styled, Typography } from '@mui/material'

export const StyledBox = styled(Card)(() => ({
  width: '100%',
  padding: '24px',
  overflow: 'auto',
  maxWidth: '1024px',
  height: '100%',
  borderRadius: '18px',
}))

export const StyledWrapper = styled(Stack)(() => ({}))

export const StyledInfoRow = styled(Stack)(() => ({
  width: '100%',
  marginBottom: '8px',
  flexDirection: 'row',
}))

export const StyledInfoType = styled(Typography)(() => ({
  width: '152px',
}))

export const StyledInfoValue = styled(Typography)(() => ({
  width: 'calc(100% - 152px - 24px)',
}))

export const StyleRawBytecode = styled(StyledInfoValue)(() => ({
  overflowWrap: 'anywhere',
  fontFamily: 'roboto mono',
}))

export const StyledSectionHeader = styled(Typography)(() => ({
  fontSize: '18px',
}))
