import { all, takeLatest } from 'typed-redux-saga'

import { structLogsActions } from './structlogs.slice'
import { fetchStructlogsSaga } from './saga/fetchStructlogs/fetchStructlogs.saga'
import { startPreparingStructlogsSaga } from './saga/prepareStructlogs/prepareStructlogs.saga'

export function* structlogsMasterSaga(): Generator {
  yield all([
    takeLatest(structLogsActions.fetchStructlogs.type, fetchStructlogsSaga),
    takeLatest(structLogsActions.startPreparingStructlogs.type, startPreparingStructlogsSaga),
  ])
}
