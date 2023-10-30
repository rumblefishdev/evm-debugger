import { Stack, Typography, styled } from '@mui/material'

export const StyledContentWrapper = styled(Stack)({
  width: '100%',
  height: '100%',
})

export const NotAContractHero = styled(Typography)(() => ({
  textAlign: 'center',
  gridRow: 2,
  gridColumn: 'span 2',
  alignSelf: 'center',
}))
