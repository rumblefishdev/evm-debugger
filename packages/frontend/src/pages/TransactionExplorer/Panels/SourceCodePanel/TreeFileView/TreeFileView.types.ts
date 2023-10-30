import type { MuiTreeViewNode } from '../../../../../helpers/muiTreeViewUtils'

export interface ITreeFileViewProps {
  expandedTreeNodes: string[]
  selectedTreeNode: string
  sourceFilesTreeItems: MuiTreeViewNode[]
  handleExpandToggle: (_: React.SyntheticEvent, nodeIds: string[]) => void
  handleSelect: (_: React.SyntheticEvent, nodeId: string) => void
}
