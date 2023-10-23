import { styled } from '@mui/material'
import { FixedSizeList } from 'react-window'

export const StyledVirtualisedList = styled(FixedSizeList)(({ theme }) => ({
  borderTopLeftRadius: '3px',
  borderBottomLeftRadius: '3px',
  borderBottom: `1px solid ${theme.palette.rfLinesLight}`,
  ...theme.customStyles.scrollbar,
}))
