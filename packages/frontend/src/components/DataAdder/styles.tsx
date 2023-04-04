import { Dialog, Input, Stack, styled, Typography } from '@mui/material'

import { Button } from '../Button'

export const StyledDialog = styled(Dialog)(() => ({}))

export const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(6),
  maxWidth: '80vw',
  height: '100%',
  boxSizing: 'border-box',
}))

export const StyledHeader = styled(Stack)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(6),
  gap: theme.spacing(1),
}))

export const StyledTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  color: theme.palette.rfSecondary,
}))

export const StyledDescription = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  textAlign: 'left',
  color: theme.palette.rfDisabledDark,
}))

export const StyledInputLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.label,
  marginBottom: theme.spacing(1),
  display: 'inline',
  color: theme.palette.rfSecondary,
}))

export const StyledInputLabelStar = styled(Typography)<{ component?: 'span' }>(
  ({ theme }) => ({
    ...theme.typography.label,
    display: 'inline',
    color: theme.palette.rfBrandSecondary,
  }),
)

export const StyledTextArea = styled(Input)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2, 3),
  overflow: 'auto',
  minHeight: '224px',
  maxHeight: '424px',
  marginBottom: theme.spacing(6),
  height: '100%',
  boxSizing: 'border-box',
  ...theme.customStyles.scrollbar,
  ...theme.typography.bodySmall,

  borderRadius: '3px',
  border: `1px solid ${theme.palette.rfLines}`,

  // remove after and before
  '&::before': {
    content: 'none',
  },
  '&::after': {
    content: 'none',
  },

  '& textarea': {
    alignSelf: 'baseline',
  },
}))

export const StyledButtonWrapper = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'space-between',
  flexDirection: 'row',
}))

export const StyledButton = styled(Button)<{ component?: 'label' }>(() => ({
  width: '196px',
}))
