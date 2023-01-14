import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(10, 0),
  justifyContent: 'space-between',
  height: '100%',
  flexDirection: 'row',
  alignItems: 'flex-start',
  '& .MuiTypography-root': {
    color: theme.palette.colorWhite,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 0),
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}))

export const LeftSideWrapper = styled(Stack)(({ theme }) => ({
  height: '100%',
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    justifyContent: 'space-between',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    flexWrap: 'wrap',
  },
}))
export const LeftContentWrapper = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(0, 4),
  height: '100%',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(2, 0),
  },
}))
export const ContactWrapper = styled(Stack)(({ theme }) => ({
  marginRight: theme.spacing(6),
  height: '100%',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(2, 0),
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))
export const ContactDetailsWrapper = styled(Stack)(({ theme }) => ({
  height: '100%',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(2, 0),
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
}))
export const RightSideWrapper = styled(Stack)(({ theme }) => ({
  width: '240px',
  justifyContent: 'space-between',
  height: '280px',
  flexDirection: 'column',
  alignItems: 'flex-end',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginTop: theme.spacing(1),
    height: 'unset',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
}))
export const StyledHeading = styled(Typography)(({ theme }) => ({
  opacity: 0.5,
  marginBottom: theme.spacing(3.5),
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(1.5),
  },
}))
export const StyledItem = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}))
export const StyledImg = styled(`img`)(({ theme }) => ({
  width: '20px',
  margin: theme.spacing(0, 1),
  height: '20px',
}))

export const StyledRow = styled('div')({
  flexDirection: 'column',
  background: 'gray',
})

export const StyledClutchBox = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.6),
  marginTop: theme.spacing(10.5),
  borderRadius: '12px',
  [theme.breakpoints.down('md')]: {
    position: 'absolute',
    margin: 'auto',
    left: '39%',
    bottom: '10%',
  },
  [theme.breakpoints.down('sm')]: {
    position: 'static',
    paddingBottom: '4%',
    padding: 0,
    marginLeft: '25%',
    margin: 'auto',
  },
}))
