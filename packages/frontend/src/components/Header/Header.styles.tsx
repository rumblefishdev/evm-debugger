import { styled } from '@mui/material'

export const Wrapper = styled('div')(({ theme: { spacing } }) => ({
  display: 'flex',
  alignItems: 'center',
  '& > *:first-child': {
    paddingLeft: 0,
  },
  '& > *': {
    paddingLeft: spacing(2),
  },
}))
