import { Box, Stack, Typography, styled } from '@mui/material'

export const StyledWrapper = styled(Stack)({
  height: '100%',

  flexDirection: 'column',
})

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 1, 0.5, 1),
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledCodeSectionWrapper = styled(Stack)(({ theme }) => ({
  borderRadius: '8px',
  backgroundColor: theme.palette.rfLinesLight,
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  fontSize: '1.3rem',
  color: theme.palette.rfText,
}))

export const StyledCode = styled(Typography)(({ theme }) => ({
  ...theme.typography.label,
  padding: theme.spacing(0, 1, 1, 1),
  lineHeight: '1.2rem',
  lineBreak: 'anywhere',
  fontSize: '1rem',
  color: '#436850',
}))

export const StyledNavigationButtonsWrapper = styled(Stack)({
  marginTop: '1rem',
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
})

export const StyledPassesThroughSection = styled(Stack)({
  width: '100%',
  height: '100%',
})

export const StyledStepCount = styled(StyledCode)(({ theme }) => ({
  padding: theme.spacing(0),
  color: theme.palette.rfBlack,
}))

export const StyledListWrapper = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1),
  height: '100%',
  flexDirection: 'column',
}))

export const StyledStepElement = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(1),
  justifyContent: 'space-between',
  flexDirection: 'row',
  cursor: 'pointer',
  borderRadius: '2px',
  border: `1px solid ${theme.palette.rfLinesLight}`,
  alignItems: 'center',

  ...(active && {
    border: `1px solid ${theme.palette.rfButton}`,
  }),
}))

export const StyledPassElementText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  ...theme.typography.buttonSmall,
  textAlign: 'left',
  color: theme.palette.rfDisabledDark,
  ...(active && {
    color: theme.palette.rfButton,
  }),
}))

export const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  textOverflow: 'ellipsis',
  textAlign: 'center',
  padding: theme.spacing(0.5, 2),

  overflow: 'hidden',
  borderRadius: '21px',
  ...theme.typography.caption,
  color: theme.palette.rfDisabledDark,

  backgroundColor: theme.palette.rfBackground,
  ...(active && {
    color: theme.palette.rfWhite,
    background: theme.palette.rfButton,
  }),
}))
