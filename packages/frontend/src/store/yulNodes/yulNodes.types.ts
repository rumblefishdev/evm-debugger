import type {
  NodeType,
  TYulAssignment,
  TYulBlock,
  TYulExpressionStatement,
  TYulForLoop,
  TYulFunctionCall,
  TYulFunctionDefinition,
  TYulIf,
  TYulVariableDeclaration,
} from '@evm-debuger/types'

export type TParsedYulBlock = Omit<TYulBlock, 'statements'> & { statements: string[] }
export type TParsedYulAssignment = Omit<TYulAssignment, 'variableNames' | 'value'> & { variableNames: string[]; value: string }
export type TParsedYulExpressionStatement = Omit<TYulExpressionStatement, 'expression'> & { expression: string }
export type TParsedYulFunctionDefinition = Omit<TYulFunctionDefinition, 'parameters' | 'returnVariables' | 'body'> & {
  parameters: string[]
  returnVariables: string[]
  body: string
}
export type TParsedYulVariableDeclaration = Omit<TYulVariableDeclaration, 'variables' | 'value'> & { variables: string[]; value: string }
export type TParsedYulForLoop = Omit<TYulForLoop, 'condition' | 'pre' | 'post' | 'body'> & {
  condition: string
  pre: string
  post: string
  body: string
}
export type TParsedYulIf = Omit<TYulIf, 'condition' | 'body'> & { condition: string; body: string }
export type TParsedYulFunctionCall = Omit<TYulFunctionCall, 'functionName' | 'arguments'> & { functionName: string; arguments: string[] }

export type TYulNodeLinkedElement = { elementSrc: string; elementNodeType: NodeType; rootNodeType: NodeType; rootSrc: string }

export type TYulNodeBaseWithListIndex = TYulNodeLinkedElement & { listIndex: number }

export type TYulNodeElements = Record<string, TYulNodeBaseWithListIndex>

export type TYulNodeState = { address: string; yulNodes: TYulNodeElements }
