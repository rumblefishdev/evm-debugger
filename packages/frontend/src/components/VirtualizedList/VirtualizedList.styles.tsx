import { styled } from '@mui/material'
import { Virtuoso } from 'react-virtuoso'

export const StyledVirtualizedList = styled(Virtuoso)(({ theme }) => ({
  width: '100%',
  height: '100%',

  borderTopLeftRadius: '3px',
  borderBottomLeftRadius: '3px',
  borderBottom: `1px solid ${theme.palette.rfLinesLight}`,
  ...theme.customStyles.scrollbar,
}))
