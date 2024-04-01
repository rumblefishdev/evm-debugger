import { KeyboardArrowDown } from '@mui/icons-material'
import { Chip, Stack, Typography, styled } from '@mui/material'

export const TraceLogElementContainer = styled(Stack)(({ theme }) => ({
  minHeight: theme.spacing(4),
  height: '100%',
  gap: theme.spacing(1),
  flexDirection: 'row',
  cursor: 'pointer',
  alignItems: 'center',
}))

export const StyledChipOptions = {
  shouldForwardProp: (prop: string) => prop !== 'isReverted',
}
export const StyledChip = styled(
  Chip,
  StyledChipOptions,
)<{ isRevertd: boolean }>(({ theme, isRevertd }) => ({
  // fontWeight: 'bold',
  //   fontSize: theme.typography.body2,
  color: isRevertd ? theme.palette.rfWhite : theme.palette.rfBlack,
  backgroundColor: isRevertd ? theme.palette.rfBrandSecondary : theme.palette.rfLinesLight,
}))

export const StyledFailureIcon = styled(Typography)(({ theme }) => ({
  paddingRight: theme.spacing(2),
}))

export const StyledArrowDownOptions = {
  shouldForwardProp: (prop: string) => prop !== 'shouldRotate' && prop !== 'isActive',
}
export const StyledArrowDown = styled(
  KeyboardArrowDown,
  StyledArrowDownOptions,
)<{ shouldRotate: boolean; isActive: boolean }>(({ shouldRotate, isActive, theme }) => ({
  transition: 'all 0.3s ease',
  transform: `rotate(${shouldRotate ? '180deg' : '0deg'})`,
  color: isActive ? theme.palette.rfButton : theme.palette.rfBlack,
}))

export const StyledFunctionSignatureOptions = {
  shouldForwardProp: (prop: string) => prop !== 'isActive',
}
export const StyledFunctionSignature = styled(
  Typography,
  StyledFunctionSignatureOptions,
)<{ isActive: boolean }>(({ theme, isActive }) => ({
  ...theme.typography.body2,
  whiteSpace: 'nowrap',
  color: isActive ? theme.palette.rfButton : theme.palette.rfBlack,
}))

export const StyledInnerFunctionWrapperOptions = {
  shouldForwardProp: (prop: string) => prop !== 'isActive',
}

export const StyledInnerFunctionSignature = styled(Typography)<{ isActiveElement: boolean; isActiveGroup: boolean }>(
  ({ theme, isActiveElement, isActiveGroup }) => ({
    ...theme.typography.body2,
    whiteSpace: 'nowrap',
    fontWeight: isActiveGroup ? 'bold' : 'normal',

    cursor: 'pointer',
    color: isActiveElement ? theme.palette.rfButton : theme.palette.rfBlack,

    '&:hover': {
      color: theme.palette.rfButton,
    },
  }),
)
