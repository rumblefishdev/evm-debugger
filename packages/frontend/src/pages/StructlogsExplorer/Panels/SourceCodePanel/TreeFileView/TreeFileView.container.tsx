import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useTypedDispatch } from '../../../../../store/storeHooks'
import {
  getExpandedNodes,
  getNodeIdByPath,
  parsePathsToMuiTreeView,
  type MuiTreeViewNode,
  getPathByNodeId,
} from '../../../../../helpers/muiTreeViewUtils'
import { activeSourceFileSelectors } from '../../../../../store/activeSourceFile/activeSourceFile.selectors'
import { activeSourceFileActions } from '../../../../../store/activeSourceFile/activeSourceFile.slice'
import { sourceCodesSelectors } from '../../../../../store/sourceCodes/sourceCodes.selectors'

import { TreeFileView } from './TreeFileView.component'

export const TreeFileViewContainer: React.FC = () => {
  const dispatch = useTypedDispatch()

  const activeSourceFileId = useSelector(activeSourceFileSelectors.selectActiveSourceFile)
  const sourceFiles = useSelector(sourceCodesSelectors.selectCurrentSourceFiles)

  const [sourceFilesNameToIdMap, setSourceFilesNameToIdMap] = useState<Record<string, number>>({})

  const [sourceFilesTreeItems, setSourceFilesTreeItems] = useState<MuiTreeViewNode[]>([])
  const [expandedTreeNodes, setExpandedTreeNodes] = useState<string[]>(['/'])
  const [selectedTreeNode, setSelectedTreeNode] = useState<string>('/')

  useEffect(() => {
    setSourceFilesNameToIdMap(sourceFiles.reduce((files, file, index) => ({ ...files, [file.name]: index }), {}))
    setSourceFilesTreeItems(parsePathsToMuiTreeView(sourceFiles.map((item) => item.name)))
    setExpandedTreeNodes(getExpandedNodes([sourceFiles[0]?.name]))
    setSelectedTreeNode(getNodeIdByPath(sourceFiles[0]?.name))
  }, [sourceFiles])

  useEffect(() => {
    if (sourceFiles[activeSourceFileId]) {
      setExpandedTreeNodes(getExpandedNodes([sourceFiles[activeSourceFileId]?.name]))
      setSelectedTreeNode(getNodeIdByPath(sourceFiles[activeSourceFileId]?.name))
    }
  }, [sourceFiles, activeSourceFileId])

  const handleSelect = (_: React.SyntheticEvent, nodeId: string) => {
    setSelectedTreeNode(nodeId)
    const fileName = getPathByNodeId(nodeId)
    if (sourceFiles.some((file) => file.name === fileName)) {
      dispatch(activeSourceFileActions.setActiveSourceFile(sourceFilesNameToIdMap[fileName]))
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
