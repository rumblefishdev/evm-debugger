import { Stack, styled, Typography } from '@mui/material'

export const StyledContentWrapper = styled(Stack)({
  width: '100%',
  overflow: 'hidden',
  height: '100%',
})

export const StyledListsWrapper = styled(Stack)(({ theme }) => ({
  overflow: 'hidden',
  height: '100%',
  gap: theme.spacing(1),
  flexDirection: 'row',
}))

export const NotAContractHero = styled(Typography)(() => ({
  textAlign: 'center',
  gridRow: 2,
  gridColumn: 'span 2',
  alignSelf: 'center',
}))
