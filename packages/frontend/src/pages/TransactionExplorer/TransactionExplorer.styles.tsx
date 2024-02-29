import { Stack, Typography, styled } from '@mui/material'

export const StyledContentWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  minHeight: '100%',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
  alignSelf: 'flex-start',

  // ...theme.customStyles.scrollbar,
}))

export const NotAContractHero = styled(Typography)(() => ({
  textAlign: 'center',
  gridRow: 2,
  gridColumn: 'span 2',
  alignSelf: 'center',
}))

export const StyledHeading = styled(Typography)
