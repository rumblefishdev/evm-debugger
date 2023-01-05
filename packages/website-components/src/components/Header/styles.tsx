import { Box, Stack, styled } from '@mui/material'

export const StyledHeader = styled(Box)(({ theme }) => ({
  zIndex: 1000,
  width: '100%',
  top: 0,
  position: 'fixed',
  left: 0,
  background: theme.palette.colorWhite,
}))
export const StyledTextContainer = styled(Stack)(({ theme }) => ({
  width: '55%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    ...theme.mixins.flexColumnStartStart,
  },
}))
export const StyledWrapper = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  borderBottom: `1px solid ${theme.palette.colorBackground?.dark}`,
}))
