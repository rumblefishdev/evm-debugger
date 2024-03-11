import { NodeType } from '@evm-debuger/types'
import type { TYulBlock, TYulNode, TYulTypedName, TYulLiteral, TYulIdentifier } from '@evm-debuger/types'

import type {
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

const createIdentifier = (src: string): string => src.split(':').slice(0, 3).join(':')

const pushAsMainElement = (node: TYulNode, parentNode: TYulNode, yulNodesLinkArray: TYulNodeLinkedElement[]) => {
  yulNodesLinkArray.push({
    rootSrc: createIdentifier(node.src),
    rootNodeType: node.nodeType,
    elementSrc: createIdentifier(node.src),
    elementNodeType: node.nodeType,
  })
}

const pushAsChildElement = (node: TYulNode, parentNode: TYulNode, yulNodesLinkArray: TYulNodeLinkedElement[]) => {
  yulNodesLinkArray.push({
    rootSrc: createIdentifier(node.src),
    rootNodeType: node.nodeType,
    elementSrc: createIdentifier(parentNode.src),
    elementNodeType: parentNode.nodeType,
  })
}

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
        pushAsMainElement(node, parentNode, yulNodesLinkArray)
        const mappedStatements = node.statements.map((child) => traverse(child, node))
        yulNodeBlocks.push({ ...node, statements: mappedStatements, src: identifier })
        break
      }
      case NodeType.YulAssignment: {
        pushAsMainElement(node, parentNode, yulNodesLinkArray)
        traverse(node.value, node)
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
        pushAsMainElement(node, parentNode, yulNodesLinkArray)
        const mappedExpression = traverse(node.expression, node)
        yulExpressionStatements.push({ ...node, src: identifier, expression: mappedExpression })
        break
      }
      case NodeType.YulFunctionDefinition: {
        pushAsMainElement(node, parentNode, yulNodesLinkArray)
        node.parameters?.forEach((child) => traverse(child, node))
        node.returnVariables?.forEach((child) => traverse(child, node))
        const mappedBody = traverse(node.body, node)
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
        pushAsMainElement(node, parentNode, yulNodesLinkArray)
        const mappedValue = traverse(node.value, node)
        const mappedVariables = node.variables.map((child) => traverse(child, node))
        yulVariableDeclarations.push({ ...node, variables: mappedVariables, value: mappedValue, src: identifier })
        break
      }
      case NodeType.YulForLoop: {
        pushAsMainElement(node, parentNode, yulNodesLinkArray)
        const mappedCondition = traverse(node.condition, node)
        const mappedPost = traverse(node.post, node)
        const mappedPre = traverse(node.pre, node)
        const mappedBody = traverse(node.body, node)
        yulForLoops.push({ ...node, src: identifier, pre: mappedPre, post: mappedPost, condition: mappedCondition, body: mappedBody })
        break
      }
      case NodeType.YulIf: {
        pushAsMainElement(node, parentNode, yulNodesLinkArray)
        traverse(node.condition, node)
        traverse(node.body, node)
        yulIfs.push({
          ...node,
          src: identifier,
          condition: { src: createIdentifier(node.condition.src), name: node.condition.functionName.name },
          body: createIdentifier(node.body.src),
        })
        break
      }
      case NodeType.YulFunctionCall: {
        pushAsMainElement(node, parentNode, yulNodesLinkArray)
        traverse(node.functionName, node)
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
        pushAsChildElement(node, parentNode, yulNodesLinkArray)
        yulTypedNames.push({ ...node, src: identifier })
        break
      }
      case NodeType.YulLiteral: {
        pushAsChildElement(node, parentNode, yulNodesLinkArray)
        yulLiterals.push({ ...node, src: identifier })
        break
      }
      case NodeType.YulIdentifier: {
        pushAsChildElement(node, parentNode, yulNodesLinkArray)
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
