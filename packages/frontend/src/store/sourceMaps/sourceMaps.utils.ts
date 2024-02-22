import { NodeType } from '@evm-debuger/types'
import type { TYulBlock, TYulNode, TYulNodeBase } from '@evm-debuger/types'

export const convertYulTreeToArray = (yulTree: TYulBlock): Record<string, TYulNodeBase> => {
  const yulArray: TYulNodeBase[] = []

  const traverse = (node: TYulNode) => {
    yulArray.push({ src: node.src, nodeType: node.nodeType })

    if (node.nodeType === NodeType.YulBlock) {
      node.statements.forEach(traverse)
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
      node.parameters?.forEach(traverse)
      node.returnVariables?.forEach(traverse)
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
      node.arguments.forEach(traverse)
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

  return yulArray.reduce<Record<string, TYulNodeBase>>((accumulator, node) => {
    accumulator[node.src] = node
    return accumulator
  }, {})
}
