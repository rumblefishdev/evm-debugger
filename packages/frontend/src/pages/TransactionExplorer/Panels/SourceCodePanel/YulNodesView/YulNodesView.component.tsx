import React from 'react'
import type { TYulNodeBase } from '@evm-debuger/types'
import type { VirtuosoHandle } from 'react-virtuoso'

import { VirtualizedList } from '../../../../../components/VirtualizedList/VirtualizedList'

import { StyledNodeElementContainer, StyledWrapper } from './YulNodesView.styles'
import type { TYulNodeViewComponentProps } from './YulNodesView.types'

export const YulNodeElement: React.FC<{ node: TYulNodeBase; active?: boolean }> = ({ node, active }) => {
  return (
    <StyledNodeElementContainer active={active}>
      {node.src} {node.nodeType}
    </StyledNodeElementContainer>
  )
}

export const YulNodesViewComponent = React.forwardRef<VirtuosoHandle, TYulNodeViewComponentProps>(({ yulNodes, activeYulNode }, ref) => {
  return (
    <StyledWrapper>
      <VirtualizedList
        items={Object.values(yulNodes)}
        ref={ref}
      >
        {(listIndex, nodeData) => {
          return (
            <YulNodeElement
              key={listIndex}
              node={nodeData}
              active={activeYulNode && activeYulNode.src === nodeData.src}
            />
          )
        }}
      </VirtualizedList>
    </StyledWrapper>
  )
})
