import { Stack, styled, Typography } from '@mui/material'

export const StyledContentWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '100%',
  gridTemplateRows: 'min-content 1fr',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  display: 'grid',
  columnGap: theme.spacing(2),
  alignItems: 'stretch',
  '> div': {
    overflow: 'hidden',
    gridRow: 2,
  },
}))

export const NotAContractHero = styled(Typography)(() => ({
  textAlign: 'center',
  gridRow: 2,
  gridColumn: 'span 2',
  alignSelf: 'center',
}))
