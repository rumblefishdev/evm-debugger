import { Stack, styled } from '@mui/material'

const StyledCardsWrapperOptions = {
  shouldForwardProp: (prop: string) => prop !== 'expanded',
}

export const StyledCardsWrapper = styled(
  Stack,
  StyledCardsWrapperOptions,
)<{ expanded: boolean }>(({ theme, expanded }) => ({
  justifyContent: 'space-between',
  height: expanded ? 256 : 112,
  gap: theme.spacing(1),
  flexDirection: 'row',
  alignItems: 'center',
}))
