import { Tooltip, styled, Typography } from '@mui/material'
import { Stack } from '@mui/system'

export const StyledTooltip = styled(Tooltip)(() => ({}))

export const StyledWrapper = styled(Stack)(() => ({
  flexDirection: 'column',
}))

export const StyledInfoRow = styled(Stack)(() => ({
  flexDirection: 'row',
}))

export const StyledInfoType = styled(Typography)(() => ({
  width: '96px',
}))

export const StyledInfoValue = styled(Typography)(() => ({}))
