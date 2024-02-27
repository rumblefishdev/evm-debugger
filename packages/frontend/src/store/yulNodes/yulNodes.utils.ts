import { NodeType } from '@evm-debuger/types'
import type { TYulBlock, TYulNode, TYulTypedName, TYulLiteral, TYulIdentifier } from '@evm-debuger/types'

import type {
  TYulNodeElementsWithListIndexDictionary,
  TYulNodeLinkedElement,
  TParsedYulAssignment,
  TParsedYulBlock,
  TParsedYulExpressionStatement,
  TParsedYulForLoop,
  TParsedYulFunctionCall,
  TParsedYulFunctionDefinition,
  TParsedYulIf,
  TParsedYulVariableDeclaration,
} from './yulNodes.types'

const createIdentifier = (src: string): string => src.split(':').slice(0, 2).join(':')

export const convertYulTreeToArray = (yulTree: TYulBlock) => {
  const yulNodesLinkArray: TYulNodeLinkedElement[] = []
  const yulNodeBlocks: TParsedYulBlock[] = []
  const yulNodeAssignments: TParsedYulAssignment[] = []
  const yulExpressionStatements: TParsedYulExpressionStatement[] = []
  const yulFunctionDefinitions: TParsedYulFunctionDefinition[] = []
  const yulVariableDeclarations: TParsedYulVariableDeclaration[] = []
  const yulForLoops: TParsedYulForLoop[] = []
  const yulIfs: TParsedYulIf[] = []
  const yulFunctionCalls: TParsedYulFunctionCall[] = []
  const yulTypedNames: TYulTypedName[] = []
  const yulLiterals: TYulLiteral[] = []
  const yulIdentifiers: TYulIdentifier[] = []

  const traverse = (node: TYulNode, parentNode?: TYulNode) => {
    const identifier = createIdentifier(node.src)

    switch (node.nodeType) {
      case NodeType.YulBlock: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        const mappedStatements = node.statements.map((child) => traverse(child, node))
        yulNodeBlocks.push({ ...node, statements: mappedStatements, src: identifier })
        break
      }
      case NodeType.YulAssignment: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        const mappedValue = traverse(node.value)
        const mappedVariableNames = node.variableNames.map((child) => traverse(child, node))
        yulNodeAssignments.push({ ...node, variableNames: mappedVariableNames, value: mappedValue, src: identifier })
        break
      }
      case NodeType.YulExpressionStatement: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        const mappedExpression = traverse(node.expression)
        yulExpressionStatements.push({ ...node, src: identifier, expression: mappedExpression })
        break
      }
      case NodeType.YulFunctionDefinition: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        const mappedParameters = node.parameters?.map((child) => traverse(child, node))
        const mappedReturnVariables = node.returnVariables?.map((child) => traverse(child, node))
        const mappedBody = traverse(node.body)
        yulFunctionDefinitions.push({
          ...node,
          src: identifier,
          returnVariables: mappedReturnVariables,
          parameters: mappedParameters,
          body: mappedBody,
        })
        break
      }
      case NodeType.YulVariableDeclaration: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        const mappedValue = traverse(node.value)
        const mappedVariables = node.variables.map((child) => traverse(child, node))
        yulVariableDeclarations.push({ ...node, variables: mappedVariables, value: mappedValue, src: identifier })
        break
      }
      case NodeType.YulForLoop: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        const mappedCondition = traverse(node.condition)
        const mappedPost = traverse(node.post)
        const mappedPre = traverse(node.pre)
        const mappedBody = traverse(node.body)
        yulForLoops.push({ ...node, src: identifier, pre: mappedPre, post: mappedPost, condition: mappedCondition, body: mappedBody })
        break
      }
      case NodeType.YulIf: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        const mappedCondition = traverse(node.condition)
        const mappedBody = traverse(node.body)
        yulIfs.push({ ...node, src: identifier, condition: mappedCondition, body: mappedBody })
        break
      }
      case NodeType.YulFunctionCall: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        const mappedFunctionName = traverse(node.functionName)
        const mappedArguments = node.arguments.map((child) => traverse(child, node))
        yulFunctionCalls.push({ ...node, src: identifier, functionName: mappedFunctionName, arguments: mappedArguments })
        break
      }
      case NodeType.YulTypedName: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        yulTypedNames.push({ ...node, src: identifier })
        break
      }
      case NodeType.YulLiteral: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        yulLiterals.push({ ...node, src: identifier })
        break
      }
      case NodeType.YulIdentifier: {
        yulNodesLinkArray.push({ rootSrc: identifier, rootNodeType: node.nodeType, elementSrc: identifier, elementNodeType: node.nodeType })
        yulIdentifiers.push({ ...node, src: identifier })
        break
      }
      default:
        break
    }

    return identifier
  }

  traverse(yulTree)

  console.log('yulNodesLinkArray', yulNodesLinkArray)

  console.log('yulNodeBlocks', yulNodeBlocks)
  console.log('yulNodeAssignments', yulNodeAssignments)
  console.log('yulExpressionStatements', yulExpressionStatements)
  console.log('yulFunctionDefinitions', yulFunctionDefinitions)
  console.log('yulVariableDeclarations', yulVariableDeclarations)
  console.log('yulForLoops', yulForLoops)
  console.log('yulIfs', yulIfs)
  console.log('yulFunctionCalls', yulFunctionCalls)
  console.log('yulTypedNames', yulTypedNames)
  console.log('yulLiterals', yulLiterals)
  console.log('yulIdentifiers', yulIdentifiers)

  console.log('===================================')

  return {
    yulVariableDeclarations,
    yulTypedNames,
    yulNodesLinkArray,
    yulNodeBlocks,
    yulNodeAssignments,
    yulLiterals,
    yulIfs,
    yulIdentifiers,
    yulFunctionDefinitions,
    yulFunctionCalls,
    yulForLoops,
    yulExpressionStatements,
  }
}
