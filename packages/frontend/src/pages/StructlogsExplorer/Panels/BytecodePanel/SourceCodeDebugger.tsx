import { usePreviousProps } from '@mui/utils'
import { useEffect, useState } from 'react'
import TreeItem from '@mui/lab/TreeItem'
import { useSelector } from 'react-redux'
import type { TStepInstruction } from '@evm-debuger/types'

import { ArrowDownBlack } from '../../../../icons'
import { useSources } from '../../../../components/SourceCodeDisplayer'
import { StyledLoading, StyledSyntaxHighlighter } from '../../../../components/SourceCodeDisplayer/styles'
import { useTypedDispatch, useTypedSelector } from '../../../../store/storeHooks'
import { contractNamesSelectors } from '../../../../store/contractNames/contractNames.selectors'
import { activeSourceFileSelectors } from '../../../../store/activeSourceFile/activeSourceFile.selectors'
import { structlogsSelectors } from '../../../../store/structlogs/structlogs.selectors'
import { activeBlockSelectors } from '../../../../store/activeBlock/activeBlock.selector'
import { activeSourceFileActions } from '../../../../store/activeSourceFile/activeSourceFile.slice'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'
import type { MuiTreeViewNode } from '../../../../helpers/muiTreeViewUtils'
import { getExpandedNodes, getNodeIdByPath, getPathByNodeId, parsePathsToMuiTreeView } from '../../../../helpers/muiTreeViewUtils'

import { NoSourceCodeHero, StyledSourceSection, StyledSourceSectionHeading, StyledSourceWrapper, StyledTreeView } from './styles'

type SourceCodeDebuggerProps = {
  source?: string
}

export const SourceCodeDebugger = ({ source }: SourceCodeDebuggerProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useTypedDispatch()

  const activeSourceFileId = useSelector(activeSourceFileSelectors.selectActiveSourceFile)
  const activeStrucLog = useSelector(structlogsSelectors.selectActiveStructLog)
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const { instructions } = useTypedSelector((state) => instructionsSelectors.selectByAddress(state, activeBlock.address))
  const { contractName } = useTypedSelector((state) => contractNamesSelectors.selectByAddress(state, activeBlock.address))

  const [sourceFiles, setSourceFiles] = useState<{ sourceCode: string; name: string }[]>([])
  const [sourceFilesNameToIdMap, setSourceFilesNameToIdMap] = useState<Record<string, number>>({})
  const [activeInstruction, setActiveInstruction] = useState<TStepInstruction>()
  const [activeSourceCode, setActiveSourceCode] = useState<string>()
  const [shouldHighlight, setShouldHighlight] = useState(false)

  const [sourceFilesTreeItems, setSourceFilesTreeItems] = useState<MuiTreeViewNode[]>([])
  const [expandedTreeNodes, setExpandedTreeNodes] = useState<string[]>(['/'])
  const [selectedTreeNode, setSelectedTreeNode] = useState<string>('/')

  const sourceNameToCodeMap = useSources(contractName, source)

  useEffect(() => {
    const _sourceFiles = Object.entries(sourceNameToCodeMap).map(([name, sourceCode]) => ({ sourceCode, name })) || []
    setSourceFiles(_sourceFiles)
    setSourceFilesNameToIdMap(_sourceFiles.reduce((files, file, index) => ({ ...files, [file.name]: index }), {}))
    setSourceFilesTreeItems(parsePathsToMuiTreeView(_sourceFiles.map((item) => item.name)))
    setExpandedTreeNodes(getExpandedNodes([_sourceFiles[0]?.name]))
    setSelectedTreeNode(getNodeIdByPath(_sourceFiles[0]?.name))
  }, [sourceNameToCodeMap])

  useEffect(() => {
    setActiveSourceCode(sourceFiles?.[activeSourceFileId]?.sourceCode || null)
  }, [sourceFiles, activeSourceFileId])

  useEffect(() => {
    if (activeStrucLog && instructions) {
      const currentInstr = instructions[activeStrucLog.pc]
      console.log('Current instruction', JSON.stringify(currentInstr, null, 2))
      setActiveInstruction(currentInstr)

      const _fileId = currentInstr?.fileId
      if (sourceFiles[_fileId]) {
        dispatch(activeSourceFileActions.setActiveSourceFile(currentInstr?.fileId))
        setExpandedTreeNodes(getExpandedNodes([sourceFiles[currentInstr?.fileId]?.name]))
        setSelectedTreeNode(getNodeIdByPath(sourceFiles[currentInstr?.fileId]?.name))
      } else {
        dispatch(activeSourceFileActions.setActiveSourceFile(null))
        console.warn(`No source file found for instruction ${JSON.stringify(currentInstr)}`)
      }
    }
  }, [activeStrucLog, instructions, sourceFiles, dispatch])

  useEffect(() => {
    if (activeInstruction?.fileId === activeSourceFileId) {
      setShouldHighlight(true)
    } else {
      setShouldHighlight(false)
    }
  }, [activeInstruction, activeSourceFileId])

  const didSourceChange = usePreviousProps({ source }).source !== source

  useEffect(() => {
    if (didSourceChange && !isLoading) setIsLoading(true)
    else {
      const timeout = setTimeout(() => setIsLoading(false), 100)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, didSourceChange])

  const handleSelect = (_: React.SyntheticEvent, nodeId: string) => {
    setSelectedTreeNode(nodeId)
    const fileName = getPathByNodeId(nodeId)
    if (Object.hasOwn(sourceNameToCodeMap, fileName)) {
      dispatch(activeSourceFileActions.setActiveSourceFile(sourceFilesNameToIdMap[fileName]))
    }
  }

  const handleExpandToggle = (_: React.SyntheticEvent, nodeIds: string[]) => {
    setExpandedTreeNodes(nodeIds)
  }

  const renderTree = (nodes: MuiTreeViewNode) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  )

  return source && sourceFiles && sourceFiles[activeSourceFileId] ? (
    isLoading || didSourceChange ? (
      <StyledLoading />
    ) : (
      <StyledSourceWrapper>
        <StyledTreeView
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
        </StyledTreeView>
        <StyledSourceSection>
          <StyledSourceSectionHeading variant="headingUnknown">{sourceFiles[activeSourceFileId].name}</StyledSourceSectionHeading>
          <StyledSyntaxHighlighter
            source={activeSourceCode}
            highlightStartLine={shouldHighlight ? activeInstruction.startCodeLine : null}
            highlightEndLine={shouldHighlight ? activeInstruction.endCodeLine : null}
          />
        </StyledSourceSection>
      </StyledSourceWrapper>
    )
  ) : (
    <NoSourceCodeHero variant="headingUnknown">No source code available for this contract</NoSourceCodeHero>
  )
}
