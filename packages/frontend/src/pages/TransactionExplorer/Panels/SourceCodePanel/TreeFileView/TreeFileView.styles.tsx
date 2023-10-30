import { TreeView } from '@mui/lab'
import { styled } from '@mui/material'

export const StyledTreeFileView = styled(TreeView)(({ theme }) => ({
  overflowX: 'hidden',
  minWidth: '30%',
  maxHeight: '100%',
}))
