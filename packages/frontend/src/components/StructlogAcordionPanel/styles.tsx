import { Accordion, AccordionSummary, Stack, styled } from '@mui/material'

export const StyledAccordion = styled(Accordion)(() => ({
  transition: 'all 0.4s ease-in-out',
  '& .MuiCollapse-root': {
    height: '100% !important',
    '& > div': {
      height: '100% !important',
      '& > div': {
        height: '100% !important',
        '& > div': {
          height: '100% !important',
          '& > div': {
            height: '100% !important',
          },
        },
      },
    },
  },
}))

export const StyledAccordionSummary = styled(AccordionSummary)(() => ({}))

export const StyledWrapper = styled(Stack)(() => ({
  width: '100%',
  position: 'relative',
  overflow: 'auto',
  height: 'calc(100% - 72px)',
}))

export const StyledContainer = styled(Stack)(() => ({
  width: '100%',
  position: 'absolute',
  height: '100%',
}))
