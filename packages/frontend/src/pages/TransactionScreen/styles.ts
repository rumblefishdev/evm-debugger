import { Stack, styled } from '@mui/material'

export const StyledContentWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '100%',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  display: 'grid',
  columnGap: theme.spacing(2),
  alignItems: 'stretch',
  '> div': {
    gridRow: 1,
  },
}))
