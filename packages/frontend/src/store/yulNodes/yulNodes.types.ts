import type {
  NodeType,
  TYulAssignment,
  TYulBlock,
  TYulExpressionStatement,
  TYulForLoop,
  TYulFunctionCall,
  TYulFunctionDefinition,
  TYulIdentifier,
  TYulIf,
  TYulLiteral,
  TYulTypedName,
  TYulVariableDeclaration,
} from '@evm-debuger/types'
import type { EntityState } from '@reduxjs/toolkit'

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

export type TExtendedYulNodeElement = TYulNodeBaseWithListIndex & {
  variableDeclaration?: TParsedYulVariableDeclaration
  typedName?: TYulTypedName
  literal?: TYulLiteral
  if?: TParsedYulIf
  identifier?: TYulIdentifier
  functionDefinition?: TParsedYulFunctionDefinition
  functionCall?: TParsedYulFunctionCall
  forLoop?: TParsedYulForLoop
  expressionStatement?: TParsedYulExpressionStatement
  block?: TParsedYulBlock
  assignment?: TParsedYulAssignment
}

export type TYulNodeElementsWithListIndexDictionary = Record<string, TYulNodeBaseWithListIndex>

export type TYulNodeBaseEntity = EntityState<TYulNodeLinkedElement>
export type TYulBlockEntity = EntityState<TParsedYulBlock>
export type TYulAssignmentEntity = EntityState<TParsedYulAssignment>
export type TYulExpressionStatementEntity = EntityState<TParsedYulExpressionStatement>
export type TYulFunctionDefinitionEntity = EntityState<TParsedYulFunctionDefinition>
export type TYulVariableDeclarationEntity = EntityState<TParsedYulVariableDeclaration>
export type TYulForLoopEntity = EntityState<TParsedYulForLoop>
export type TYulIfEntity = EntityState<TParsedYulIf>
export type TYulFunctionCallEntity = EntityState<TParsedYulFunctionCall>
export type TYulTypedNameEntity = EntityState<TYulTypedName>
export type TYulLiteralEntity = EntityState<TYulLiteral>
export type TYulIdentifierEntity = EntityState<TYulIdentifier>

export type TYulNodeStateContent = {
  address: string
  yulNodes: TYulNodeBaseEntity
  yulBlocks: TYulBlockEntity
  yulAssignments: TYulAssignmentEntity
  yulExpressionStatements: TYulExpressionStatementEntity
  yulFunctionDefinitions: TYulFunctionDefinitionEntity
  yulVariableDeclarations: TYulVariableDeclarationEntity
  yulForLoops: TYulForLoopEntity
  yulIfs: TYulIfEntity
  yulFunctionCalls: TYulFunctionCallEntity
  yulTypedNames: TYulTypedNameEntity
  yulLiterals: TYulLiteralEntity
  yulIdentifiers: TYulIdentifierEntity
}

export type TYulNodeState = Record<string, TYulNodeStateContent>

export type TInitializeYulNodesForContractPayload = {
  address: string
}

export type TAddYulNodesPayload = {
  address: string
  yulNodes: TYulNodeLinkedElement[]
}

export type TAddYulBlocksPayload = {
  address: string
  yulBlocks: TParsedYulBlock[]
}

export type TAddYulAssignmentsPayload = {
  address: string
  yulAssignments: TParsedYulAssignment[]
}

export type TAddYulExpressionStatementsPayload = {
  address: string
  yulExpressionStatements: TParsedYulExpressionStatement[]
}

export type TAddYulFunctionDefinitionsPayload = {
  address: string
  yulFunctionDefinitions: TParsedYulFunctionDefinition[]
}

export type TAddYulVariableDeclarationsPayload = {
  address: string
  yulVariableDeclarations: TParsedYulVariableDeclaration[]
}

export type TAddYulForLoopsPayload = {
  address: string
  yulForLoops: TParsedYulForLoop[]
}

export type TAddYulIfsPayload = {
  address: string
  yulIfs: TParsedYulIf[]
}

export type TAddYulFunctionCallsPayload = {
  address: string
  yulFunctionCalls: TParsedYulFunctionCall[]
}

export type TAddYulTypedNamesPayload = {
  address: string
  yulTypedNames: TYulTypedName[]
}

export type TAddYulLiteralsPayload = {
  address: string
  yulLiterals: TYulLiteral[]
}

export type TAddYulIdentifiersPayload = {
  address: string
  yulIdentifiers: TYulIdentifier[]
}
