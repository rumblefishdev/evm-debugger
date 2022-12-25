import { all, fork } from 'typed-redux-saga'

import { disassembleNewlyAddedBytescodes } from './disassembler.saga'

export function* bytescodesMasterSaga(): Generator {
  yield all([fork(disassembleNewlyAddedBytescodes)])
}
