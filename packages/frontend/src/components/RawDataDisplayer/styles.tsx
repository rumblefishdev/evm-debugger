import { Dialog, Stack, styled, Typography } from '@mui/material'

export const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    maxWidth: 'unset',
    maxHeight: 'unset',
    margin: 'unset',
  },
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      width: '684px',
      maxHeight: '680px',
      boxShadow: 'none',
    },
  },
}))

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(6),
  overflow: 'auto',
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

export const StyledDataWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflow: 'auto',
  height: '100%',
  flexDirection: 'row',
  ...theme.customStyles.scrollbar,
}))
export const StyledDataIndexesWrapper = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  height: '100%',
  border: `1px solid ${theme.palette.rfLinesLight}`,
  backgroundColor: theme.palette.rfBackground,
}))
export const StyledDataIndex = styled(Typography)(() => ({
  width: '38px',
  textAlign: 'center',
  lineHeight: '22.5px',
  fontWeight: 700,
  fontSize: '10px',
  fontFamily: 'Inter',
}))
export const StyledDataBox = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2, 4),
  height: '100%',
  boxSizing: 'border-box',
  borderWidth: '1px 1px 1px 0px',
  borderStyle: 'solid',
  borderColor: theme.palette.rfLinesLight,
}))
export const StyledDataJson = styled(Typography)(({ theme }) => ({
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  lineHeight: '21px',
  fontFamily: 'monospace',
  ...theme.typography.bodySmall,
  color: theme.palette.rfSecondary,
}))

export const StyledBytecode = styled(StyledDataJson)(() => ({
  fontFamily: 'Ibm Plex Mono',
}))
