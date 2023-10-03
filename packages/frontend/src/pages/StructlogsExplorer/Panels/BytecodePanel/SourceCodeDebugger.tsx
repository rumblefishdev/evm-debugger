import { usePreviousProps } from '@mui/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TreeItem from '@mui/lab/TreeItem'
import getLineFromPos from 'get-line-from-pos'
import { useSelector } from 'react-redux'

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

import { NoSourceCodeHero, StyledSourceSection, StyledSourceSectionHeading, StyledSourceWrapper, StyledTreeView } from './styles'

type SourceCodeDebuggerProps = {
  source?: string
}

interface RenderTree {
  id: string
  name: string
  children?: readonly RenderTree[]
  index?: number
  isFile?: boolean
}

const parseToTree = (paths): RenderTree[] => {
  const result = []
  const level = { result }

  paths
    .map((elem) => elem.name)
    .forEach((path, index) => {
      path.split('/').reduce((r, name) => {
        if (!r[name]) {
          r[name] = { result: [] }
          const treeElem: RenderTree = {
            name,
            isFile: `${path.split('/').slice(-1)}` === name,
            index,
            id: `${path}-${name}`,
            children: r[name].result,
          }
          r.result.push(treeElem)
        }
        return r[name]
      }, level)
    })
  return result
}

const parseDefaultExpanded = (sourceItems): string[] => {
  if (sourceItems && sourceItems[0]) {
    const defaultExpanded: string[] = ['-1']
    const { name } = sourceItems[0]
    const items: string[] = name.split('/')
    for (let index = 2; index <= items.length; index++) defaultExpanded.push(`${name}-${items.slice(index * -1)[0]}`)

    return defaultExpanded
  }
  return null
}
export const SourceCodeDebugger = ({ source }: SourceCodeDebuggerProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useTypedDispatch()
  const activeSourceFile = useSelector(activeSourceFileSelectors.selectActiveSourceFile)
  const activeStrucLog = useSelector(structlogsSelectors.selectActiveStructLog)
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const instructions = useTypedSelector((state) => instructionsSelectors.selectByAddress(state, activeBlock.address))

  const { contractName } = useTypedSelector((state) => contractNamesSelectors.selectByAddress(state, activeBlock.address))

  let highlightStartLine
  let highlightEndLine
  if (activeStrucLog && instructions) {
    // TODO: This code need to be adjusted after sync with backend
    const currentInstruction = instructions[activeStrucLog.pc]
    const codeLocation = currentInstruction.location
    highlightStartLine = getLineFromPos(codeLocation.file.content, codeLocation.offset)
    highlightEndLine = getLineFromPos(codeLocation.file.content, codeLocation.offset + codeLocation.length)
  }
  const sources = useSources(contractName, source)

  const sourceItems = useMemo(
    () =>
      sources
        ? Object.entries(sources).map(([name, sourceCode]) => ({
            sourceCode,
            name,
          }))
        : [],
    [sources],
  )

  const getSourceCode = useMemo(
    () => (sourceItems && sourceItems[activeSourceFile] ? sourceItems[activeSourceFile].sourceCode : null),
    [activeSourceFile, sourceItems],
  )

  const defaultSelected = useMemo(
    () => (sourceItems && sourceItems[0] ? `${sourceItems[0].name}-${sourceItems[0].name.split('/').slice(-1)}` : null),
    [sourceItems],
  )

  const sourceItemsTree = useMemo(() => parseToTree(sourceItems), [sourceItems])

  const { source: prevSource } = usePreviousProps({ source }) as {
    source?: string
  }
  const didSourceChange = prevSource !== source

  useEffect(() => {
    if (didSourceChange && !isLoading) setIsLoading(true)
    else {
      const timeout = setTimeout(() => setIsLoading(false), 100)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, didSourceChange])

  const clickAction = useCallback(
    (index: number, isFile: boolean) => {
      if (isFile) dispatch(activeSourceFileActions.setActiveSourceFile(index))
    },
    [dispatch],
  )

  const renderTree = (nodes: RenderTree) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={() => clickAction(nodes.index, nodes.isFile)}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  )

  return source && sourceItems && sourceItems[activeSourceFile] ? (
    isLoading || didSourceChange ? (
      <StyledLoading />
    ) : (
      <StyledSourceWrapper>
        <StyledTreeView
          className="file-list-tree"
          defaultCollapseIcon={<ArrowDownBlack />}
          defaultExpandIcon={<ArrowDownBlack />}
          defaultExpanded={parseDefaultExpanded(sourceItems)}
          defaultSelected={defaultSelected}
        >
          {renderTree({
            name: 'files',
            id: '-1',
            children: sourceItemsTree,
          })}
        </StyledTreeView>
        <StyledSourceSection>
          <StyledSourceSectionHeading variant="headingUnknown">{sourceItems[activeSourceFile].name}</StyledSourceSectionHeading>
          <StyledSyntaxHighlighter
            source={getSourceCode}
            highlightStartLine={highlightStartLine}
            highlightEndLine={highlightEndLine}
          />
        </StyledSourceSection>
      </StyledSourceWrapper>
    )
  ) : (
    <NoSourceCodeHero variant="headingUnknown">No source code available for this contract</NoSourceCodeHero>
  )
}
