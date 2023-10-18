import type { MuiTreeViewNode } from '../../../../../helpers/muiTreeViewUtils'
import type { TSourceFiles } from '../SourceCodePanel.types'

export interface ITreeFileViewProps {
  expandedTreeNodes: string[]
  selectedTreeNode: string
  sourceFilesTreeItems: MuiTreeViewNode[]
  handleExpandToggle: (_: React.SyntheticEvent, nodeIds: string[]) => void
  handleSelect: (_: React.SyntheticEvent, nodeId: string) => void
}

export interface ITreeFileViewContainerProps {
  sourceFiles: TSourceFiles[]
}
