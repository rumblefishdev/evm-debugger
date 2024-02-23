import { Stack, Typography, styled } from '@mui/material'

export const StyledContentWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  spacing: theme.spacing(1),
  minHeight: '100%',
  marginTop: theme.spacing(8),
  justifyContent: 'flex-start',

  // ...theme.customStyles.scrollbar,
}))

export const NotAContractHero = styled(Typography)(() => ({
  textAlign: 'center',
  gridRow: 2,
  gridColumn: 'span 2',
  alignSelf: 'center',
}))

export const StyledHeading = styled(Typography)
