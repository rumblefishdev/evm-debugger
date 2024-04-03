import type { TooltipProps } from '@mui/material'
import { Stack, styled, Tooltip, tooltipClasses, Typography } from '@mui/material'
import { Done, ContentCopy } from '@mui/icons-material'

export const StyledFunctionInputParameterContainerTooltip = styled(({ className, ...props }: TooltipProps) => (
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
    borderRadius: '6px',
    border: `1px solid ${theme.palette.grey[300]}`,
    backgroundColor: 'white',
  },
}))

export const StyledContentWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '100%',
  gap: theme.spacing(1),
  flexDirection: 'column',
  display: 'inline-flex',
}))

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(1),
  height: '100%',
  gap: theme.spacing(1),
  flexDirection: 'row',
}))

export const StyledFunctionSingatureParameter = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',
  padding: theme.spacing(0, 0.5),
  opacity: 0.9,
  margin: theme.spacing(0, 0.5),
  borderRadius: '4px',

  '&:hover': {
    opacity: 1,
  },
}))

export const StyledTextWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  flexDirection: 'row',
  display: 'inline-flex',
  alignItems: 'center',
}))

export const StyledText = styled(Typography)({
  width: '100%',
  whiteSpace: 'nowrap',
  fontSize: '14px',
  display: 'inline-block',
  color: 'black',
})

export const StyledContentCopyIcon = styled(ContentCopy)({
  width: '18px',
  height: '18px',
  cursor: 'pointer',
  color: '#000000B3',
  '&:hover': {
    color: '#000000',
  },
})

export const StyledContentCopiedIcon = styled(Done)(({ theme }) => ({
  width: '18px',
  height: '18px',
  color: theme.palette.rfButton,
}))
