import { call, put, type SagaGenerator } from 'typed-redux-saga'

import { convertYulTreeToArray } from '../../yulNodes.utils'
import type { TYulNodesActions } from '../../yulNodes.slice'
import { yulNodesActions } from '../../yulNodes.slice'

export function* createYulNodesStructure({ payload }: TYulNodesActions['createYulNodesStructure']): SagaGenerator<void> {
  const { address, content } = payload

  try {
    const {
      yulExpressionStatements,
      yulForLoops,
      yulFunctionCalls,
      yulFunctionDefinitions,
      yulIdentifiers,
      yulIfs,
      yulLiterals,
      yulNodeAssignments,
      yulNodeBlocks,
      yulNodesLinkArray,
      yulTypedNames,
    } = yield* call(convertYulTreeToArray, content)

    yield* put(yulNodesActions.initializeYulNodesForContract({ address }))
    yield* put(yulNodesActions.addYulExpressionStatements({ yulExpressionStatements, address }))
    yield* put(yulNodesActions.addYulForLoops({ yulForLoops, address }))
    yield* put(yulNodesActions.addYulFunctionCalls({ yulFunctionCalls, address }))
    yield* put(yulNodesActions.addYulFunctionDefinitions({ yulFunctionDefinitions, address }))
    yield* put(yulNodesActions.addYulIdentifiers({ yulIdentifiers, address }))
    yield* put(yulNodesActions.addYulIfs({ yulIfs, address }))
    yield* put(yulNodesActions.addYulLiterals({ yulLiterals, address }))
    yield* put(yulNodesActions.addYulAssignments({ yulAssignments: yulNodeAssignments, address }))
    yield* put(yulNodesActions.addYulBlocks({ yulBlocks: yulNodeBlocks, address }))
    yield* put(yulNodesActions.addYulTypedNames({ yulTypedNames, address }))
    yield* put(yulNodesActions.addYulNodes({ yulNodes: yulNodesLinkArray, address }))
  } catch (error) {
    console.log(error)
  }
}
