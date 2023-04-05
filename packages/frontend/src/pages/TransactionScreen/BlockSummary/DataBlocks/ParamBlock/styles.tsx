import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from '@mui/material'

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  padding: theme.spacing(4, 6),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.rfLinesLight}`,

  '&.MuiAccordion-root:before': {
    display: 'none',
  },

  '&.Mui-expanded': {
    margin: 0,
    border: `1px solid ${theme.palette.rfButton}`,
  },
}))

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  ...theme.typography.buttonSmall,
  minHeight: '0',
  color: theme.palette.rfButton,
  '&.Mui-expanded': {
    minHeight: '0',
    margin: 0,
  },
}))

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.rfLinesLight}`,
}))
