import { all, fork, takeLatest } from 'typed-redux-saga'

import { disassembleNewlyAddedBytescodes } from './saga/disassembleBytecode/disassembler.saga'
import { fetchBytecodesSaga } from './saga/fetchBytecodes/fetchBytecodes.saga'
import { bytecodesActions } from './bytecodes.slice'

export function* bytescodesMasterSaga(): Generator {
  yield all([fork(disassembleNewlyAddedBytescodes), takeLatest(bytecodesActions.fetchBytecodes, fetchBytecodesSaga)])
}
