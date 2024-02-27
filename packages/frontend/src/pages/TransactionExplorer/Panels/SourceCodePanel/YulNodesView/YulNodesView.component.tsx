import React from 'react'
import type { VirtuosoHandle } from 'react-virtuoso'

import { VirtualizedList } from '../../../../../components/VirtualizedList/VirtualizedList'
import type { TExtendedYulNodeElement, TYulNodeBaseWithListIndex } from '../../../../../store/yulNodes/yulNodes.types'

import { StyledNodeElementContainer, StyledWrapper } from './YulNodesView.styles'
import type { TYulNodeViewComponentProps } from './YulNodesView.types'

export const YulNodeElement: React.FC<{ node: TExtendedYulNodeElement; active?: boolean }> = ({ node, active }) => {
  return (
    <StyledNodeElementContainer active={active}>
      {node.rootSrc} {node.rootNodeType}
      {node.typedName && <span>{node.typedName.name}</span>}
      {node.literal && <span>{node.literal.value}</span>}
      {node.identifier && <span>{node.identifier.name}</span>}
    </StyledNodeElementContainer>
  )
}

export const YulNodesViewComponent = React.forwardRef<VirtuosoHandle, TYulNodeViewComponentProps>(({ yulNodes, activeYulNode }, ref) => {
  return (
    <StyledWrapper>
      <VirtualizedList
        items={yulNodes}
        ref={ref}
      >
        {(listIndex, nodeData) => {
          return (
            <YulNodeElement
              key={listIndex}
              node={nodeData}
              active={activeYulNode && activeYulNode.rootSrc === nodeData.rootSrc}
            />
          )
        }}
      </VirtualizedList>
    </StyledWrapper>
  )
})
