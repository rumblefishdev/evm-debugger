import { Stack, styled } from '@mui/material'

export const StyledWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '100%',
  gap: theme.spacing(1),
}))

// ==============================================================

export const StyledNodeElementContainerOptions = {
  shouldForwardProp: (prop: string) => prop !== 'active',
}

export const StyledNodeElementContainer = styled(
  Stack,
  StyledNodeElementContainerOptions,
)<{ active: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(2, 3),
  minHeight: '16px',
  margin: theme.spacing(0.5, 0),
  backgroundColor: active ? '#DEC792' : theme.palette.rfBackground,
}))
