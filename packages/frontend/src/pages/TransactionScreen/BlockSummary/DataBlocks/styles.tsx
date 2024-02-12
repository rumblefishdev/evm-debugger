import { Accordion, AccordionDetails, AccordionSummary, Stack, styled, Typography } from '@mui/material'

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  outlineWidth: '1px',
  outlineStyle: 'solid',
  outlineOffset: '-1px',
  outlineColor: theme.palette.rfLinesLight,
  minHeight: '32px',
  margin: theme.spacing(2, 0, 0, 0),
  boxShadow: 'none',

  backgroundColor: theme.palette.rfWhite,
  '&:first-of-type': {
    marginTop: '0px',
  },

  '&:before': {
    display: 'none',
  },

  '&.Mui-expanded': {
    outlineColor: theme.palette.rfButton,
    minHeight: '32px',
    margin: theme.spacing(2, 0, 0, 0),
  },

  '& .MuiAccordionSummary-root': {
    minHeight: '32px',
  },
}))

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  minHeight: '32px',
  margin: 0,
  color: theme.palette.rfButton,

  '& .MuiAccordionSummary-content': {
    margin: 0,
  },

  '& .Mui-expanded': {
    margin: 0,
  },
}))

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  marginTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.rfLinesLight}`,
}))

export const StyledInfoRow = styled(Stack)(() => ({
  width: '100%',
  marginTop: '8px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  flexDirection: 'row',
}))

export const StyledInfoType = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodySmallBold,
  color: theme.palette.rfDisabled,
}))

export const StyledInfoValue = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodySmall,
  overflowWrap: 'anywhere',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
}))
