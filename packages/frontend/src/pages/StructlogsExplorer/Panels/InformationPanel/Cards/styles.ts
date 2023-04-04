import {
  Stack,
  styled,
  Table,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'

export const StyledWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflow: 'auto',
  height: '100%',
  gap: theme.spacing(2),
}))

export const StyledRecord = styled(Stack)(() => ({
  textAlign: 'left',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledRecordType = styled(Typography)(({ theme }) => ({
  width: '72px',
  textAlign: 'left',
  marginRight: theme.spacing(4),
  fontWeight: 500,
  fontSize: '13px',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
}))

export const StyledRecordValue = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  marginRight: 'auto',
  fontWeight: 400,
  fontSize: '13px',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
}))

export const StyledTable = styled(Table)(({ theme }) => ({
  width: '100%',
  overflow: 'auto',
  height: '100%',
  gap: theme.spacing(2),
}))

export const StyledTableRow = styled(TableRow)(() => ({
  textAlign: 'left',
}))

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'left',
  padding: `0 ${theme.spacing(4)} ${theme.spacing(3)} 0`,
  marginRight: theme.spacing(4),
  fontWeight: 500,
  fontSize: '13px',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
  border: 'none',
  width: 1,
}))

export const StyledTableValueCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'left',
  padding: `0 0 ${theme.spacing(3)} 0`,
  marginRight: 'auto',
  fontWeight: 400,
  fontSize: '13px',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
  border: 'none',
}))
