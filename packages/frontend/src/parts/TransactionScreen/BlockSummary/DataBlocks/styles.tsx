import { Accordion, AccordionDetails, AccordionSummary, Stack, styled, Typography } from '@mui/material'

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  padding: theme.spacing(0, 6),
  outline: 'none',
  boxShadow: 'none',
  borderWidth: '1px 1px 0px 1px',
  borderStyle: 'solid',
  borderColor: theme.palette.rfLinesLight,
  backgroundColor: theme.palette.rfWhite,

  '&:before': {
    display: 'none',
  },

  '&.Mui-expanded': {
    margin: 0,
    borderWidth: '1px',
    borderColor: theme.palette.rfButton,
  },
}))

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  minHeight: 'unset',
  color: theme.palette.rfButton,

  '&.Mui-expanded': {
    minHeight: 'unset',
    margin: 0,
  },

  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
}))

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  marginTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.rfLinesLight}`,
}))

export const StyledInfoRow = styled(Stack)(() => ({
  width: '100%',
  flexDirection: 'row',
}))

export const StyledInfoType = styled(Typography)(({ theme }) => ({
  width: '116px',
  ...theme.typography.bodySmallBold,
  color: theme.palette.rfDisabled,
}))

export const StyledInfoValue = styled(Typography)(({ theme }) => ({
  minWidth: '360px',
  ...theme.typography.bodySmall,
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
}))
export const StyleRawBytecode = styled(StyledInfoValue)(() => ({
  overflowWrap: 'anywhere',
}))
