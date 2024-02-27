import React from 'react'
import type { VirtuosoHandle } from 'react-virtuoso'

import { VirtualizedList } from '../../../../../components/VirtualizedList/VirtualizedList'
import type { TExtendedYulNodeElement } from '../../../../../store/yulNodes/yulNodes.types'

import {
  StyledNodeElementContainer,
  StyledNodeElementContentWrapper,
  StyledNodeElementParametersWrapper,
  StyledWrapper,
} from './YulNodesView.styles'
import type { TYulNodeViewComponentProps } from './YulNodesView.types'

export const YulNodeElement: React.FC<{ allNodes: TExtendedYulNodeElement[]; node: TExtendedYulNodeElement; active?: boolean }> = ({
  node,
  active,
}) => {
  return (
    <StyledNodeElementContainer active={active}>
      {node.rootSrc} {node.rootNodeType}
      {node.typedName && <span>{node.typedName.name}</span>}
      {node.literal && <span>{node.literal.value}</span>}
      {node.identifier && <span>{node.identifier.name}</span>}
      {node.functionDefinition && (
        <StyledNodeElementContentWrapper>
          <StyledNodeElementParametersWrapper>
            <span>FunctionName: </span>
            <span>{node.functionDefinition.name}</span>
          </StyledNodeElementParametersWrapper>
          <StyledNodeElementParametersWrapper>
            <span>Parameters: </span>
            <span>{node.functionDefinition.parameters?.map((param) => param.name).join(' | ')}</span>
          </StyledNodeElementParametersWrapper>
          <StyledNodeElementParametersWrapper>
            <span>ReturnVariables: </span>
            <span>{node.functionDefinition.returnVariables?.map((param) => param.name).join(' | ')}</span>
          </StyledNodeElementParametersWrapper>
        </StyledNodeElementContentWrapper>
      )}
      {node.functionCall && (
        <StyledNodeElementContentWrapper>
          <StyledNodeElementParametersWrapper>
            <span>FunctionName: </span>
            <span>{node.functionCall.functionName.name}</span>
          </StyledNodeElementParametersWrapper>
          <StyledNodeElementParametersWrapper>
            <span>Arguments: </span>
            <span>{node.functionCall.arguments?.map((param) => param.name).join(' | ')}</span>
          </StyledNodeElementParametersWrapper>
        </StyledNodeElementContentWrapper>
      )}
      {node.assignment && (
        <StyledNodeElementContentWrapper>
          <StyledNodeElementParametersWrapper>
            <span>VariableNames: </span>
            <span>{node.assignment.variableNames?.map((param) => param.name).join(' | ')}</span>
          </StyledNodeElementParametersWrapper>
          <StyledNodeElementParametersWrapper>
            <span>Value: </span>
            <span>{node.assignment.value.name}</span>
          </StyledNodeElementParametersWrapper>
        </StyledNodeElementContentWrapper>
      )}
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
              allNodes={yulNodes}
              active={activeYulNode && activeYulNode.rootSrc === nodeData.rootSrc}
            />
          )
        }}
      </VirtualizedList>
    </StyledWrapper>
  )
})
