import { Accordion, AccordionDetails, AccordionSummary, Stack, styled } from '@mui/material'

type TCanExpand = {
  canExpand: boolean
}

export const StyledAccordion = styled(Accordion)<TCanExpand>(({ theme, canExpand, expanded }) => ({
  transition: 'all 0.4s ease-in-out',
  padding: theme.spacing(0, 6),
  outline: 'none',
  boxShadow: 'none',
  borderWidth: '1px 1px 0px 1px',
  borderStyle: 'solid',
  borderColor: theme.palette.rfLinesLight,
  backgroundColor: theme.palette.rfWhite,

  '&:last-of-type': {
    borderWidth: '1px',
  },

  '&:before': {
    display: 'none',
  },

  '&.Mui-expanded': {
    margin: 0,
  },

  ...(canExpand && {
    cursor: 'pointer',
  }),
  ...(expanded && {
    marginBottom: '1px',
    flexGrow: 1,
    borderWidth: '1px 1px 0px 1px',
    borderColor: theme.palette.rfButton,
    backgroundColor: 'rgba(47, 87, 244, 0.05)',
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
  }),
}))

export const StyledAccordionSummary = styled(AccordionSummary)<TCanExpand>(({ theme, canExpand }) => ({
  padding: theme.spacing(4, 0, 5, 0),
  minHeight: 'unset',
  color: theme.palette.rfDisabled,

  '&.Mui-expanded': {
    minHeight: 'unset',
  },

  '& .MuiAccordionSummary-content': {
    margin: 0,
  },

  ...(canExpand && {
    color: theme.palette.rfButton,
  }),
}))
export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  margin: 0,
}))

export const StyledWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  overflow: 'auto',
  height: 'calc(100% - 72px)',
  ...theme.customStyles.scrollbar,
}))

export const StyledContainer = styled(Stack)(() => ({
  width: '100%',
  position: 'absolute',
  margin: 0,
}))
