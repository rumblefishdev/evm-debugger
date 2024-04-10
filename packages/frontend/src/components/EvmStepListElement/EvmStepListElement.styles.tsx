import type { TooltipProps } from '@mui/material'
import { Stack, styled, Tooltip, tooltipClasses, Typography } from '@mui/material'

type TActive = { active?: boolean }

export const StyledStack = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<TActive>(({ theme, active }) => ({
  width: '100%',
  padding: theme.spacing(0, 2),
  minHeight: '64px',
  maxHeight: '64px',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
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
  marginRight: theme.spacing(2),
  color: theme.palette.rfSecondary,

  ...(active && {
    color: theme.palette.rfButton,
  }),
}))

export const StyledWrapper = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'space-between',

  flexDirection: 'row',

  alignItems: 'center',
}))

export const StyledLeftSideWrapper = styled(Stack)({
  flexWrap: 'wrap',
  flexDirection: 'row',
  flex: '2',
  display: 'flex',
  alignItems: 'center',
})

export const StyledType = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<TActive>(({ theme, active }) => ({
  ...theme.typography.buttonSmall,
  textAlign: 'left',
  marginRight: theme.spacing(1),
  display: 'flex',
  color: theme.palette.rfDisabledDark,
  alignItems: 'center',
  ...(active && {
    color: theme.palette.rfButton,
  }),
}))

export const StyledChip = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<TActive>(({ theme, active }) => ({
  padding: theme.spacing(1, 2),
  maxWidth: '192px',
  flexWrap: 'nowrap',
  flexDirection: 'row',
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
  whiteSpace: 'nowrap',
  maxWidth: '192px',

  ...(active && {
    color: theme.palette.rfWhite,
  }),
}))

export const StyledGasTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    width: 'auto',
    padding: theme.spacing(2),
    height: 'auto',
    display: 'inline-table',
    color: 'black',
    borderRadius: '6px',
    border: `1px solid ${theme.palette.grey[300]}`,
    backgroundColor: 'white',
  },
}))
