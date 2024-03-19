import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { useTypedDispatch } from '../../../../../store/storeHooks'
import {
  getExpandedNodes,
  getNodeIdByPath,
  parsePathsToMuiTreeView,
  type MuiTreeViewNode,
  getPathByNodeId,
} from '../../../../../helpers/muiTreeViewUtils'
import { activeLineActions } from '../../../../../store/activeLine/activeLine.slice'
import { sourceFilesSelectors } from '../../../../../store/sourceFiles/sourceFiles.selectors'
import { sourceFilesActions } from '../../../../../store/sourceFiles/sourceFiles.slice'

import { TreeFileView } from './TreeFileView.component'

export const TreeFileViewContainer: React.FC = () => {
  const dispatch = useTypedDispatch()

  const [expandedTreeNodes, setExpandedTreeNodes] = useState<string[]>(['/'])
  const [selectedTreeNode, setSelectedTreeNode] = useState<string>('/')

  const activeSourceFileId = useSelector(sourceFilesSelectors.selectSourceFileId)
  const sourceFiles = useSelector(sourceFilesSelectors.selectCurrentSourceFiles)

  const sourceFilesNameToIdMap = useMemo<Record<string, number>>(
    () => sourceFiles.reduce((files, file, index) => ({ ...files, [file.path]: index }), {}),
    [sourceFiles],
  )

  const sourceFilesTreeItems = useMemo<MuiTreeViewNode[]>(
    () => parsePathsToMuiTreeView(sourceFiles.map((item) => item.path)),
    [sourceFiles],
  )

  useEffect(() => {
    setExpandedTreeNodes(getExpandedNodes([sourceFiles[0]?.path]))
    setSelectedTreeNode(getNodeIdByPath(sourceFiles[0]?.path))
  }, [sourceFiles])

  useEffect(() => {
    if (sourceFiles[activeSourceFileId]) {
      setExpandedTreeNodes(getExpandedNodes([sourceFiles[activeSourceFileId]?.path]))
      setSelectedTreeNode(getNodeIdByPath(sourceFiles[activeSourceFileId]?.path))
    }
  }, [sourceFiles, activeSourceFileId])

  const handleSelect = (_: React.SyntheticEvent, nodeId: string) => {
    setSelectedTreeNode(nodeId)
    const fileName = getPathByNodeId(nodeId)
    if (sourceFiles.some((file) => file.path === fileName)) {
      dispatch(sourceFilesActions.setActiveSourceFileId(sourceFilesNameToIdMap[fileName]))
      dispatch(activeLineActions.clearActiveLine())
    }
  }

  const handleExpandToggle = (_: React.SyntheticEvent, nodeIds: string[]) => {
    setExpandedTreeNodes(nodeIds)
  }

  return (
    <TreeFileView
      expandedTreeNodes={expandedTreeNodes}
      handleExpandToggle={handleExpandToggle}
      handleSelect={handleSelect}
      selectedTreeNode={selectedTreeNode}
      sourceFilesTreeItems={sourceFilesTreeItems}
    />
  )
}
