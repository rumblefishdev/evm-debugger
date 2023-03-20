import { Stack, styled, Typography } from '@mui/material'

export const StyledContentWrapper = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'space-around',
  height: '100%',
  gap: '8px',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const NotAContractHero = styled(Typography)(() => ({
  textAlign: 'center',
  flex: '1',
}))
