import { Accordion, styled } from '@mui/material'

export const StyledAccordion = styled(Accordion)(() => ({
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
