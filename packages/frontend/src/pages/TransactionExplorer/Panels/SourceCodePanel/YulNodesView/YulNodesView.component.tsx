import React from 'react'
import type { VirtuosoHandle } from 'react-virtuoso'

import { VirtualizedList } from '../../../../../components/VirtualizedList/VirtualizedList'
import type { TExtendedYulNodeElement } from '../../../../../store/yulNodes/yulNodes.types'

import {
  StyledNodeElementContainer,
  StyledNodeElementContentWrapper,
  StyledNodeElementParameters,
  StyledNodeElementParametersWrapper,
  StyledWrapper,
} from './YulNodesView.styles'
import type { TYulNodeViewComponentProps } from './YulNodesView.types'

export const YulNodeElement: React.FC<{
  allNodes: TExtendedYulNodeElement[]
  node: TExtendedYulNodeElement
  activeElement?: boolean
  activeNodeSrc?: string
}> = ({ node, activeElement, activeNodeSrc }) => {
  return (
    <StyledNodeElementContainer active={activeElement}>
      {node.rootSrc} {node.rootNodeType}
      {node.typedName && <span>{node.typedName.name}</span>}
      {node.literal && <span>{node.literal.value}</span>}
      {node.identifier && <span>{node.identifier.name}</span>}
      {node.block && (
        <StyledNodeElementContentWrapper>
          <StyledNodeElementParametersWrapper>
            <span>Statements: </span>
            <StyledNodeElementParametersWrapper>
              {node.block.statements.map((statement) => {
                return (
                  <StyledNodeElementParameters
                    active={statement === activeNodeSrc && activeElement}
                    key={statement}
                  >
                    {statement}
                  </StyledNodeElementParameters>
                )
              })}
            </StyledNodeElementParametersWrapper>
          </StyledNodeElementParametersWrapper>
        </StyledNodeElementContentWrapper>
      )}
      {node.functionDefinition && (
        <StyledNodeElementContentWrapper>
          <StyledNodeElementParametersWrapper>
            <span>FunctionName: </span>
            <span>{node.functionDefinition.name}</span>
          </StyledNodeElementParametersWrapper>
          <StyledNodeElementParametersWrapper>
            <span>Parameters: </span>
            <StyledNodeElementParametersWrapper>
              {node.functionDefinition.parameters?.map((param) => (
                <StyledNodeElementParameters
                  active={param.src === activeNodeSrc && activeElement}
                  key={param.name}
                >
                  {param.name}
                </StyledNodeElementParameters>
              ))}
            </StyledNodeElementParametersWrapper>
          </StyledNodeElementParametersWrapper>
          <StyledNodeElementParametersWrapper>
            <span>ReturnVariables: </span>
            <StyledNodeElementParametersWrapper>
              {node.functionDefinition.returnVariables?.map((param) => (
                <StyledNodeElementParameters
                  active={param.src === activeNodeSrc && activeElement}
                  key={param.name}
                >
                  {param.name}
                </StyledNodeElementParameters>
              ))}
            </StyledNodeElementParametersWrapper>
          </StyledNodeElementParametersWrapper>
          <StyledNodeElementParametersWrapper>
            <span>Body: </span>
            <span>{node.functionDefinition.body}</span>
          </StyledNodeElementParametersWrapper>
        </StyledNodeElementContentWrapper>
      )}
      {node.functionCall && (
        <StyledNodeElementContentWrapper>
          <StyledNodeElementParametersWrapper>
            <span>FunctionName: </span>
            <StyledNodeElementParameters active={node.functionCall.functionName.src === activeNodeSrc && activeElement}>
              {node.functionCall.functionName.name}
            </StyledNodeElementParameters>
          </StyledNodeElementParametersWrapper>
          <StyledNodeElementParametersWrapper>
            <span>Arguments: </span>
            <StyledNodeElementParametersWrapper>
              {node.functionCall.arguments?.map((param) => (
                <StyledNodeElementParameters
                  active={param.src === activeNodeSrc && activeElement}
                  key={param.name}
                >
                  {param.name}
                </StyledNodeElementParameters>
              ))}
            </StyledNodeElementParametersWrapper>
          </StyledNodeElementParametersWrapper>
        </StyledNodeElementContentWrapper>
      )}
      {node.assignment && (
        <StyledNodeElementContentWrapper>
          <StyledNodeElementParametersWrapper>
            <span>VariableNames: </span>
            <StyledNodeElementParametersWrapper>
              {node.assignment.variableNames?.map((param) => (
                <StyledNodeElementParameters
                  active={param.src === activeNodeSrc && activeElement}
                  key={param.name}
                >
                  {param.name}
                </StyledNodeElementParameters>
              ))}
            </StyledNodeElementParametersWrapper>
          </StyledNodeElementParametersWrapper>
          <StyledNodeElementParametersWrapper>
            <span>Value: </span>
            <StyledNodeElementParameters active={node.assignment.value.src === activeNodeSrc && activeElement}>
              {node.assignment.value.name}
            </StyledNodeElementParameters>
          </StyledNodeElementParametersWrapper>
        </StyledNodeElementContentWrapper>
      )}
      {node.if && (
        <StyledNodeElementContentWrapper>
          <StyledNodeElementParametersWrapper>
            <span>Condition: </span>
            <StyledNodeElementParameters active={node.if.condition.src === activeNodeSrc && activeElement}>
              {node.if.condition.name}
            </StyledNodeElementParameters>
          </StyledNodeElementParametersWrapper>
          <StyledNodeElementParametersWrapper>
            <span>Body: </span>
            <span>{node.if.body}</span>
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
              activeElement={activeYulNode && activeYulNode.elementSrc === nodeData.rootSrc}
              activeNodeSrc={activeYulNode && activeYulNode.rootSrc}
            />
          )
        }}
      </VirtualizedList>
    </StyledWrapper>
  )
})
