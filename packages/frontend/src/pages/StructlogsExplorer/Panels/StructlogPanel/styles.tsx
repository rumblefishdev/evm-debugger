import { TextField, Typography, styled } from '@mui/material'

import { StyledHeading as MainStyledHeading, StyledListWrapper } from '../styles'

export const StyledCollapse = styled(StyledListWrapper, {
  shouldForwardProp: (prop) => prop !== 'in',
})<{ in: boolean }>(({ in: $in, theme }) => ({
  transition: 'height 0.3s ease',
  marginBottom: theme.spacing(2),
  height: $in ? '30%' : '0px',
  border: 'none',
}))

export const StyledHeading = styled(MainStyledHeading)(({ theme }) => ({
  zIndex: 1,
  top: 0,
  position: 'sticky',
  padding: theme.spacing(4, 4, 3),
  margin: 0,
  fontSize: '18px',
  display: 'flex',
  border: `1px solid ${theme.palette.rfLinesLight}`,
  background: 'white',
  alignItems: 'center',

  '&:not(:first-child)': {
    marginTop: theme.spacing(4),
  },
}))

export const StyledInput = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}))

export const StyledInfo = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 4),
  color: theme.palette.rfDisabledDark,
}))
