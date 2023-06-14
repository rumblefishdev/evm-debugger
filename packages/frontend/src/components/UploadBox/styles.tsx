import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  justifyContent: 'space-between',
  height: '40px',
  gap: theme.spacing(3),
  flexDirection: 'row',
  alignItems: 'center',
}))
/* eslint-disable */
export const StyledLabel = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  lineHeight: '100%',
  fontWeight: 600,
  fontSize: '12px',
  fontFamily: 'Rajdhani',
  textTransform: 'uppercase',
  color: theme.palette.colorWhite,
  opacity: 0.5,
}))

export const StyledTitle = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
textOverflow: "ellipsis",
whiteSpace: "nowrap",
  fontVariationSettings: "slnt 0",
  fontWeight: 300,
  fontSize: '14px',
  fontFamily: 'Inter',
  color: theme.palette.colorWhite,
  letterSpacing: "-0.01em",
}))
  /* eslint-enable */
export const StyledTextWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(0.3),
}))

export const IconWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(4),
  flexDirection: 'row',
  alignItems: 'center',
}))
