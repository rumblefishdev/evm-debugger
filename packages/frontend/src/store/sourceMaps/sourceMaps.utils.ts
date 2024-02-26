import { NodeType } from '@evm-debuger/types'
import type {
  TYulBlock,
  TYulNode,
  TYulNodeBase,
  TYulAssignment,
  TYulExpressionStatement,
  TYulForLoop,
  TYulVariableDeclaration,
  TYulTypedName,
  TYulLiteral,
  TYulFunctionCall,
  TYulFunctionDefinition,
  TYulIdentifier,
  TYulIf,
} from '@evm-debuger/types'

import type { TYulNodeElements } from '../yulNodes/yulNodes.types'

const createIdentifier = (src: string): string => src.split(':').slice(0, 2).join(':')

export const convertYulTreeToArray = (yulTree: TYulBlock): TYulNodeElements => {
  const yulNodesLinkArray: TYulNodeBase[] = []
  const yulNodeBlocks: TYulBlock[] = []
  const yulNodeAssignments: TYulAssignment[] = []
  const yulExpressionStatements: TYulExpressionStatement[] = []
  const yulFunctionDefinitions: TYulFunctionDefinition[] = []
  const yulVariableDeclarations: TYulVariableDeclaration[] = []
  const yulForLoops: TYulForLoop[] = []
  const yulIfs: TYulIf[] = []
  const yulFunctionCalls: TYulFunctionCall[] = []

  const traverse = (node: TYulNode, parentNode?: TYulNode) => {
    yulNodesLinkArray.push({ src: createIdentifier(node.src), nodeType: node.nodeType })

    switch (node.nodeType) {
      case NodeType.YulBlock:
        yulNodeBlocks.push(node)
        node.statements.forEach((child) => traverse(child, node))
        break
      case NodeType.YulAssignment:
        yulNodeAssignments.push(node)
        break
      case NodeType.YulExpressionStatement:
        yulExpressionStatements.push(node)
        break
      case NodeType.YulFunctionDefinition:
        yulFunctionDefinitions.push(node)
        break
      case NodeType.YulVariableDeclaration:
        yulVariableDeclarations.push(node)
        break
      case NodeType.YulForLoop:
        yulForLoops.push(node)
        break
      case NodeType.YulIf:
        yulIfs.push(node)
        break
      case NodeType.YulFunctionCall:
        yulFunctionCalls.push(node)
        break
      default:
        break
    }

    if (node.nodeType === NodeType.YulBlock) {
      node.statements.forEach((child) => traverse(child, node))
    }

    if (node.nodeType === NodeType.YulIf) {
      traverse(node.condition)
      traverse(node.body)
    }

    if (node.nodeType === NodeType.YulForLoop) {
      traverse(node.condition)
      traverse(node.pre)
      traverse(node.post)
      traverse(node.body)
    }

    if (node.nodeType === NodeType.YulFunctionDefinition) {
      node.parameters?.forEach((child) => traverse(child, node))
      node.returnVariables?.forEach((child) => traverse(child, node))
      traverse(node.body)
    }

    if (node.nodeType === NodeType.YulVariableDeclaration) {
      traverse(node.value)
    }

    if (node.nodeType === NodeType.YulAssignment) {
      traverse(node.value)
    }

    if (node.nodeType === NodeType.YulExpressionStatement) {
      traverse(node.expression)
    }

    if (node.nodeType === NodeType.YulFunctionCall) {
      node.arguments.forEach((child) => traverse(child, node))
      traverse(node.functionName)
    }

    if (node.nodeType === NodeType.YulTypedName) {
      // do nothing
    }

    if (node.nodeType === NodeType.YulLiteral) {
      // do nothing
    }

    if (node.nodeType === NodeType.YulIdentifier) {
      // do nothing
    }
  }

  traverse(yulTree)

  return yulNodesLinkArray.reduce<TYulNodeElements>((accumulator, node, index) => {
    accumulator[node.src] = { ...node, listIndex: index }
    return accumulator
  }, {})
}
