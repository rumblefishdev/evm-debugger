/* eslint-disable no-use-before-define */
export enum NodeType {
  YulBlock = 'YulBlock',
  YulVariableDeclaration = 'YulVariableDeclaration',
  YulLiteral = 'YulLiteral',
  YulTypedName = 'YulTypedName',
  YulIdentifier = 'YulIdentifier',
  YulFunctionCall = 'YulFunctionCall',
  YulExpressionStatement = 'YulExpressionStatement',
  YulForLoop = 'YulForLoop',
  YulAssignment = 'YulAssignment',
  YulIf = 'YulIf',
  YulFunctionDefinition = 'YulFunctionDefinition',
}

export enum ParameterNodeType {
  YulIdentifier = 'YulIdentifier',
  YulTypedName = 'YulTypedName',
}

export enum ArgumentNodeType {
  YulLiteral = 'YulLiteral',
  YulIdentifier = 'YulIdentifier',
  YulFunctionCall = 'YulFunctionCall',
}

export enum StatementNodeType {
  YulBlock = 'YulBlock',
  YulAssignment = 'YulAssignment',
  YulExpressionStatement = 'YulExpressionStatement',
  YulFunctionDefinition = 'YulFunctionDefinition',
  YulVariableDeclaration = 'YulVariableDeclaration',
  YulForLoop = 'YulForLoop',
  YulIf = 'YulIf',
}

export type TYulNodeBase = {
  nodeType: NodeType
  src: string
}

export type TYulTypedName = TYulNodeBase & { nodeType: NodeType.YulTypedName; name: string; type: string }

export type TYulLiteral = TYulNodeBase & { nodeType: NodeType.YulLiteral; value: string; type: string; kind: string; hexValue?: string }
export type TYulIdentifier = TYulNodeBase & { nodeType: NodeType.YulIdentifier; name: string }
export type TYulFunctionCall = TYulNodeBase & {
  nodeType: NodeType.YulFunctionCall
  arguments: (TYulLiteral | TYulIdentifier | TYulFunctionCall)[]
  functionName: TYulIdentifier
}

export type TYulAssignment = TYulNodeBase & {
  nodeType: NodeType.YulAssignment
  value: TYulFunctionCall | TYulIdentifier
  variableNames: TYulIdentifier[]
}
export type TYulExpressionStatement = TYulNodeBase & { nodeType: NodeType.YulExpressionStatement; expression: TYulFunctionCall }
export type TYulFunctionDefinition = TYulNodeBase & {
  nodeType: NodeType.YulFunctionDefinition
  name: string
  parameters?: TYulTypedName[]
  returnVariables?: TYulTypedName[]
  body: TYulBlock
}
export type TYulVariableDeclaration = TYulNodeBase & {
  nodeType: NodeType.YulVariableDeclaration
  value: TYulFunctionCall | TYulLiteral
  variables: TYulTypedName[]
}
export type TYulForLoop = TYulNodeBase & {
  nodeType: NodeType.YulForLoop
  condition: TYulFunctionCall
  post: TYulBlock
  pre: TYulBlock
  body: TYulBlock
}
export type TYulIf = TYulNodeBase & { nodeType: NodeType.YulIf; condition: TYulFunctionCall; body: TYulBlock }

export type TYulBlock = TYulNodeBase & {
  nodeType: NodeType.YulBlock
  statements: TYulStatementNode[]
}

export type TYulStatementNode =
  | TYulBlock
  | TYulAssignment
  | TYulExpressionStatement
  | TYulFunctionDefinition
  | TYulVariableDeclaration
  | TYulForLoop
  | TYulIf

export type TYulNode = TYulStatementNode | TYulTypedName | TYulLiteral | TYulIdentifier | TYulFunctionCall
