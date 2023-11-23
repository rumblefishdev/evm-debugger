import { Typography, styled } from '@mui/material'

export const StyledSourceSectionHeading = styled(Typography)(({ theme }) => ({
  zIndex: 10,
  top: 0,
  position: 'sticky',
  paddingBottom: theme.spacing(2),
  fontSize: theme.typography.h6.fontSize,
  display: 'block',
  color: theme.palette.rfSecondary,
  boxShadow: `0 1px 0 0 ${theme.palette.rfLinesLight}`,
  background: 'white',
}))

export const StyledSourceSection = styled('div')({
  width: '100%',
  height: '100%',
})
