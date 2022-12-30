import { Card, Stack, styled } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  height: '100%',
  flexDirection: 'column',
}))

export const StyledContentWrapper = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'space-around',
  height: 'calc(100% - 112px)',
  gap: '24px',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledStructlogPanel = styled(Card)(() => ({
  width: '824px',
  padding: '8px 16px',
  overflow: 'auto',
  height: '100%',
}))
