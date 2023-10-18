import { TreeItem } from '@mui/lab'

import type { MuiTreeViewNode } from '../../../../../helpers/muiTreeViewUtils'
import { ArrowDownBlack } from '../../../../../icons'

import { StyledTreeFileView } from './TreeFileView.styles'
import type { ITreeFileViewProps } from './TreeFileView.types'

const renderTree = (nodes: MuiTreeViewNode) => (
  <TreeItem
    key={nodes.id}
    nodeId={nodes.id}
    label={nodes.name}
  >
    {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
  </TreeItem>
)

export const TreeFileView: React.FC<ITreeFileViewProps> = ({
  expandedTreeNodes,
  handleExpandToggle,
  handleSelect,
  selectedTreeNode,
  sourceFilesTreeItems,
}) => {
  return (
    <StyledTreeFileView
      aria-label="controlled"
      className="file-list-tree"
      defaultCollapseIcon={<ArrowDownBlack />}
      defaultExpandIcon={<ArrowDownBlack />}
      expanded={expandedTreeNodes}
      onNodeToggle={handleExpandToggle}
      onNodeSelect={handleSelect}
      selected={selectedTreeNode}
    >
      {renderTree({
        name: 'Source Files',
        id: '/',
        children: sourceFilesTreeItems,
      })}
    </StyledTreeFileView>
  )
}
