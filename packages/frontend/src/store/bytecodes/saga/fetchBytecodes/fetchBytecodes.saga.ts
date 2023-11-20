import { select, type SagaGenerator, call, put, apply } from 'typed-redux-saga'

import { jsonRpcProvider } from '../../../../config'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { bytecodesSelectors } from '../../bytecodes.selectors'
import { bytecodesActions } from '../../bytecodes.slice'

export function* fetchBytecodesSaga(): SagaGenerator<void> {
  const chainId = yield* select(transactionConfigSelectors.selectChainId)
  const provider = jsonRpcProvider[chainId]

  const emptyBytecodes = yield* select(bytecodesSelectors.addressesWithMissingBytecode)

  for (const address of emptyBytecodes) {
    const bytecode = yield* apply(provider, provider.getCode, [address])
    yield* put(bytecodesActions.updateBytecode({ id: address, changes: { bytecode } }))
  }

  yield* put(bytecodesActions.finishFetchingBytecodes)
}
