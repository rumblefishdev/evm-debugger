import { Stack, styled, Typography } from '@mui/material'
/* eslint sort-keys-fix/sort-keys-fix:0*/
export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  justifyContent: 'space-between',
  gap: theme.spacing(0.5),
  // display: 'flex',
  flexWrap: 'wrap',
  height: '50%',
  flexDirection: 'row',
  alignItems: 'center',
}))

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
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontVariationSettings: 'slnt 0',
  fontWeight: 300,
  fontSize: '13px',
  fontFamily: 'Inter',
  color: theme.palette.colorWhite,
  letterSpacing: '-0.01em',
}))

export const StyledTextWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(0.3),
}))

export const IconWrapper = styled(Stack)(({ theme }) => ({
  minWidth: '265px',
  gap: theme.spacing(4),
  flexDirection: 'row',
  alignItems: 'center',
}))
