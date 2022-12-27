import { Card, Stack, styled, Typography } from '@mui/material'

export const StyledBox = styled(Card)(() => ({
  width: '100%',
  padding: '24px',
  maxWidth: '824px',
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
  width: '128px',
}))

export const StyledInfoValue = styled(Typography)(() => ({
  width: 'cacl(100% - 128px - 24px)',
  overflowWrap: 'anywhere',
}))
