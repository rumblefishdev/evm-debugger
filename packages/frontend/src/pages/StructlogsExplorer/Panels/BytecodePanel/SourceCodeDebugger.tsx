import { usePreviousProps } from '@mui/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TreeItem from '@mui/lab/TreeItem'

import { ArrowDownBlack } from '../../../../icons'
import { useSources } from '../../../../components/SourceCodeDisplayer'
import {
  StyledLoading,
  StyledSyntaxHighlighter,
} from '../../../../components/SourceCodeDisplayer/styles'

import {
  NoSourceCodeHero,
  StyledSourceSection,
  StyledSourceSectionHeading,
  StyledSourceWrapper,
  StyledTreeView,
} from './styles'

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
    for (let index = 2; index <= items.length; index++)
      defaultExpanded.push(`${name}-${items.slice(index * -1)[0]}`)

    return defaultExpanded
  }
  return null
}
export const SourceCodeDebugger = ({ source }: SourceCodeDebuggerProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [activeFile, setActiveFile] = useState<number>(0)

  const sources = useSources(source)
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
    () =>
      sourceItems && sourceItems[activeFile]
        ? sourceItems[activeFile].sourceCode
        : null,
    [activeFile, sourceItems],
  )

  const defaultSelected = useMemo(
    () =>
      sourceItems && sourceItems[0]
        ? `${sourceItems[0].name}-${sourceItems[0].name.split('/').slice(-1)}`
        : null,
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

  const clickAction = useCallback((index: number, isFile: boolean) => {
    if (isFile) setActiveFile(index)
  }, [])

  const renderTree = (nodes: RenderTree) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={() => clickAction(nodes.index, nodes.isFile)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  )

  return source && sourceItems && sourceItems[activeFile] ? (
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
          <StyledSourceSectionHeading variant="headingUnknown">
            {sourceItems[activeFile].name}
          </StyledSourceSectionHeading>
          <StyledSyntaxHighlighter source={getSourceCode} />
        </StyledSourceSection>
      </StyledSourceWrapper>
    )
  ) : (
    <NoSourceCodeHero variant="headingUnknown">
      No source code available for this contract
    </NoSourceCodeHero>
  )
}
