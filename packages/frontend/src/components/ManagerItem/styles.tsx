import { Stack, styled, Typography } from '@mui/material'

const StyledStatus = styled(Typography)(() => ({
  padding: '8px 16px',
  margin: '0 24px',
  borderRadius: '8px',
  border: '1px solid #ffa96b',
  background: 'none',
}))

export const StyledStack = styled(Stack)(() => ({
  padding: '12px 0',
  margin: '12px 0',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledName = styled(Typography)(() => ({
  width: '420px',
  textAlign: 'center',
  padding: '8px 16px',
  margin: '0 24px',
  borderRadius: '8px',
  border: '1px solid #ffa96b',
}))

export const StyledStatusFound = styled(StyledStatus)(() => ({
  color: '#ffa96b',
  borderColor: '#ffa96b',
}))

export const StyledStatusNotFound = styled(StyledStatus)(() => ({
  color: '#e04151',
  borderColor: '#e04151',
}))
