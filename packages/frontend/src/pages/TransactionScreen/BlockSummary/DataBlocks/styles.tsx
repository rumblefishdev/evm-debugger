import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  styled,
  Typography,
} from '@mui/material'

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  outlineWidth: '1px',
  outlineStyle: 'solid',
  outlineOffset: '-1px',
  outlineColor: theme.palette.rfLinesLight,

  boxShadow: 'none',

  backgroundColor: theme.palette.rfWhite,

  '&:before': {
    display: 'none',
  },

  '&.Mui-expanded': {
    outlineColor: theme.palette.rfButton,
    margin: 0,
  },
}))

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  minHeight: 'unset',
  margin: 0,
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
  paddingTop: theme.spacing(2),
  marginTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.rfLinesLight}`,
}))

export const StyledInfoRow = styled(Stack)(() => ({
  width: '100%',
  flexDirection: 'row',
}))

export const StyledInfoType = styled(Typography)(({ theme }) => ({
  minWidth: '144px',
  ...theme.typography.bodySmallBold,
  color: theme.palette.rfDisabled,
}))

export const StyledInfoValue = styled(Typography)(({ theme }) => ({
  minWidth: '360px',
  marginLeft: theme.spacing(2),
  ...theme.typography.bodySmall,
  overflowWrap: 'anywhere',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
}))
