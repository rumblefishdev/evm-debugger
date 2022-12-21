import { Card, Stack, styled } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  height: '100%',
  flexDirection: 'column',
}))

export const StyledContentWrapper = styled(Stack)(() => ({
  justifyContent: 'space-around',
  height: 'calc(100% - 112px)',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledStructLogCard = styled(Card)(() => ({
  width: '824px',
  padding: '8px 16px',
  overflow: 'auto',
  height: '100%',
}))

export const StyledInformationCard = styled(Card)(() => ({
  width: '1024px',
  padding: '8px 16px',
  height: '100%',
}))
