import { Dialog, Input, Stack, styled, Typography } from '@mui/material'

import { Button } from '../Button'
/* eslint-disable */
export const StyledDialog = styled(Dialog)(() => ({
  background: 'rgba(1,25,111,0.9)',
}))

export const StyledStack = styled(Stack)(({ theme }) => ({
display:"flex",
flexDirection:"column",
gap:theme.spacing(3),
padding:theme.spacing(3)

}))

export const StyledHeader = styled(Stack)(({ theme }) => ({
  width: '100%',
  // marginBottom: theme.spacing(6),
  gap: theme.spacing(1),
}))

export const StyledTextAreaWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
display:"flex",
flexDirection:"column",

}))

export const StyledTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  color: theme.palette.rfSecondary,
  fontFamily:"Rajdhani",
  fontStyle:"normal",
  fontWeight:700,
  fontSize:"32px",
  lineHeight:"115%",
  letterSpacing:"-0.02em",
  background:'linear-gradient(180deg, #FFFFFF 0%, rgba(217, 217, 217, 0.8) 100%)',
  WebkitBackgroundClip:'text',
  WebkitTextFillColor:"transparent",
  backgroundClip:"text",



}))

export const StyledButtonText = styled(Typography)(({ theme }) => ({
  fontFamily:"Rajdhani",
  fontStyle:"normal",
  fontWeight:500,
  fontSize:"20px",
  lineHeight:"100%",
  letterSpacing:"-0.01em",

}))

export const StyledDescription = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  textAlign: 'left',
  color: theme.palette.rfDisabledDark,
}))

export const StyledInputLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.label,
  display: 'inline',
  color: theme.palette.rfSecondary,
  textAlign: 'left',
  opacity: 0.5,
  lineHeight: '100%',
  fontWeight: 600,
  fontSize: '12px',
  fontFamily: 'Rajdhani',

}))

export const StyledInputLabelStar = styled(Typography)<{ component?: 'span' }>(({ theme }) => ({
  ...theme.typography.label,
  display: 'inline',
  color: theme.palette.rfBrandSecondary,
}))

export const StyledTextArea = styled(Input)(({ theme }) => ({
  width: '416px',
  padding: theme.spacing(2, 3),
  overflow: 'auto',
  height: '172px',
  boxSizing: 'border-box',
  background:theme.palette.type==="navy"?"rgba(255, 255, 255, 0.15)": "rgba(255,255,255,0.7)",
  ...theme.customStyles.scrollbar,
  // ...theme.typography.bodySmall,

  borderRadius: '16px',
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

export const StyledButton = styled(Button)<{ component?: 'label' }>(({ theme }) => ({
  textAlign: 'center',
  padding:theme.spacing(2),
  width: '48%', 
  color: "#FFFFFF",
  backgroundColor: "transaparent",
  // boxShadow:'0px 8px 24px rgba(255, 255, 255, 0.15)',
  border:'4px solid rgba(255, 255, 255, 0.25)',
  backgroundClip:'padding-box',
  borderRadius: "16px",
  '&:hover': {
    backgroundColor: theme.palette.primaryButtonHoverBgColor,
  },
}))
