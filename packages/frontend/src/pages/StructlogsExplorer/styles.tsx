import { Box, Stack, styled, Typography } from '@mui/material'

export const StyledContentWrapper = styled(Stack)({
  width: '100%',
  overflow: 'hidden',
  height: '100%',
})

export const StyledSourceCodeWrapper = styled(Box)(({ theme }) => ({
  // paddingBottom: theme.spacing(2),
  // height: '50vh',
  // boxSizing: 'border-box',
}))

export const StyledListsWrapper = styled(Stack)(({ theme }) => ({
  overflow: 'hidden',
  gap: theme.spacing(2),
  flexDirection: 'row',
}))

export const NotAContractHero = styled(Typography)(() => ({
  textAlign: 'center',
  gridRow: 2,
  gridColumn: 'span 2',
  alignSelf: 'center',
}))
