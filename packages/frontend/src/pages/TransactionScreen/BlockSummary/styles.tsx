import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(0, 2, 0, 0),
  overflow: 'auto',
  maxWidth: '728px',
  height: '100%',
  ...theme.customStyles.scrollbar,
}))

export const StyledInfoRow = styled(Stack)(() => ({
  width: '100%',
  flexDirection: 'row',
}))

export const StyledInfoType = styled(Typography)(({ theme }) => ({
  width: '128px',
  ...theme.typography.bodySmallBold,
  color: theme.palette.rfDisabled,
}))

export const StyledBlockWrapper = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(4, 0),
}))

export const StyledFunctionsignature = styled(Typography)(() => ({
  textAlign: 'left',
  lineHeight: '21px',
  letterSpacing: '-0.01em',
  fontWeight: 700,
  fontSize: '14px',
  fontFamily: 'Inter',
}))
export const StyledInfoValue = styled(Typography)(({ theme }) => ({
  width: '100%',
  ...theme.typography.bodySmall,
  overflowWrap: 'anywhere',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
}))

export const StyledSectionHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  color: theme.palette.rfDisabledDark,
  ...theme.typography.headingUnknown,
}))
