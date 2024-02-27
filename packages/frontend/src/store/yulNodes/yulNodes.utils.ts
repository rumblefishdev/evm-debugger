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
        traverse(node.value)
        node.variableNames.forEach((child) => traverse(child, node))
        yulNodeAssignments.push({
          ...node,
          variableNames: node.variableNames.map((child) => ({ src: createIdentifier(child.src), name: child.name })),
          value:
            node.value.nodeType === NodeType.YulFunctionCall
              ? { src: createIdentifier(node.value.src), name: node.value.functionName.name }
              : { src: createIdentifier(node.value.src), name: node.value.name },
          src: identifier,
        })
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
        node.parameters?.forEach((child) => traverse(child, node))
        node.returnVariables?.forEach((child) => traverse(child, node))
        const mappedBody = traverse(node.body)
        yulFunctionDefinitions.push({
          ...node,
          src: identifier,
          returnVariables: node?.returnVariables?.map((child) => ({ src: createIdentifier(child.src), name: child.name })),
          parameters: node?.parameters?.map((child) => ({ src: createIdentifier(child.src), name: child.name })),
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
        traverse(node.functionName)
        node.arguments.forEach((child) => traverse(child, node))
        yulFunctionCalls.push({
          ...node,
          src: identifier,
          functionName: { src: createIdentifier(node.functionName.src), name: node.functionName.name },
          arguments: node.arguments?.map((child) => {
            if (child.nodeType === NodeType.YulLiteral) {
              return { src: createIdentifier(child.src), name: child.value }
            }
            if (child.nodeType === NodeType.YulIdentifier) {
              return { src: createIdentifier(child.src), name: child.name }
            }
            return { src: createIdentifier(child.src), name: child.functionName.name }
          }),
        })
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
