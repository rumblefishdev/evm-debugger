import { Box, Stack, styled, Typography } from '@mui/material'

type TActive = { active?: boolean }

export const StyledStack = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<TActive>(({ theme, active }) => ({
  width: '100%',
  padding: theme.spacing(4.5, 6),
  minHeight: '64px',
  maxHeight: '64px',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  cursor: 'pointer',
  boxSizing: 'border-box',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: theme.palette.rfLinesLight,
  alignItems: 'center',

  '& + &': {
    borderWidth: '0px 1px 1px 1px',
  },

  // active styles
  ...(active && {
    border: `1px solid ${theme.palette.rfButton}`,
    backgroundColor: 'rgba(47, 87, 244, 0.05)',
  }),
}))

export const StyledCounter = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<TActive>(({ theme, active }) => ({
  width: '48px',
  ...theme.typography.bodySmall,
  marginRight: theme.spacing(4),
  color: theme.palette.rfSecondary,

  ...(active && {
    color: theme.palette.rfButton,
  }),
}))

export const StyledTypeWrapper = styled(Stack)(() => ({
  width: '224px',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledType = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<TActive>(({ theme, active }) => ({
  ...theme.typography.buttonSmall,
  textAlign: 'left',
  marginRight: theme.spacing(2),
  display: 'flex',
  color: theme.palette.rfDisabledDark,
  alignItems: 'center',
  ...(active && {
    color: theme.palette.rfButton,
  }),
}))

export const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<TActive>(({ theme, active }) => ({
  padding: theme.spacing(1, 2),
  maxWidth: '72px',
  borderRadius: '21px',
  backgroundColor: theme.palette.rfBackground,
  ...(active && {
    background: theme.palette.rfButton,
  }),
}))

export const StyledChipText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<TActive>(({ theme, active }) => ({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  ...theme.typography.caption,
  maxWidth: '72px',
  color: theme.palette.rfDisabledDark,

  ...(active && {
    color: theme.palette.rfWhite,
  }),
}))
