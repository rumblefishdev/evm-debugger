import { createEntityAdapter } from '@reduxjs/toolkit'
import type { TYulIdentifier, TYulLiteral, TYulTypedName } from '@evm-debuger/types'

import type {
  TParsedYulAssignment,
  TParsedYulBlock,
  TParsedYulExpressionStatement,
  TParsedYulForLoop,
  TParsedYulFunctionCall,
  TParsedYulFunctionDefinition,
  TParsedYulIf,
  TParsedYulVariableDeclaration,
  TYulNodeLinkedElement,
} from './yulNodes.types'

export const yulBaseNodeAdapter = createEntityAdapter<TYulNodeLinkedElement>({
  selectId: (entity) => entity.rootSrc,
})

export const yulBlockNodeAdapter = createEntityAdapter<TParsedYulBlock>({
  selectId: (entity) => entity.src,
})

export const yulAssignmentNodeAdapter = createEntityAdapter<TParsedYulAssignment>({
  selectId: (entity) => entity.src,
})

export const yulExpressionStatementNodeAdapter = createEntityAdapter<TParsedYulExpressionStatement>({
  selectId: (entity) => entity.src,
})

export const yulFunctionDefinitionNodeAdapter = createEntityAdapter<TParsedYulFunctionDefinition>({
  selectId: (entity) => entity.src,
})

export const yulVariableDeclarationNodeAdapter = createEntityAdapter<TParsedYulVariableDeclaration>({
  selectId: (entity) => entity.src,
})

export const yulForLoopNodeAdapter = createEntityAdapter<TParsedYulForLoop>({
  selectId: (entity) => entity.src,
})

export const yulIfNodeAdapter = createEntityAdapter<TParsedYulIf>({
  selectId: (entity) => entity.src,
})

export const yulFunctionCallNodeAdapter = createEntityAdapter<TParsedYulFunctionCall>({
  selectId: (entity) => entity.src,
})

export const yulTypedNameNodeAdapter = createEntityAdapter<TYulTypedName>({
  selectId: (entity) => entity.src,
})

export const yulLiteralNodeAdapter = createEntityAdapter<TYulLiteral>({
  selectId: (entity) => entity.src,
})

export const yulIdentifierNodeAdapter = createEntityAdapter<TYulIdentifier>({
  selectId: (entity) => entity.src,
})
