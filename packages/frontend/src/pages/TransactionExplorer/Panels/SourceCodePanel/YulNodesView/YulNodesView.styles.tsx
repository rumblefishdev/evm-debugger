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
  gap: theme.spacing(2),
  flexDirection: 'row',
  backgroundColor: active ? '#DEC792' : theme.palette.rfBackground,
}))

export const StyledNodeElementContentWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  flexDirection: 'row',
}))

export const StyledNodeElementParametersWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  flexWrap: 'nowrap',
  flexDirection: 'row',
}))
