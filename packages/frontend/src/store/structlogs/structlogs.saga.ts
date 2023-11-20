import { all, takeLatest } from 'typed-redux-saga'

import { structLogsActions } from './structlogs.slice'
import { fetchStructlogsSaga } from './saga/fetchStructlogs/fetchStructlogs.saga'
import { startPreaperingStructlogsSaga, prepareStructlogsSaga } from './saga/preaperStructlogs/preaperStructlogs.saga'

export function* structlogsMasterSaga(): Generator {
  yield all([
    takeLatest(structLogsActions.fetchStructlogs.type, fetchStructlogsSaga),
    takeLatest(structLogsActions.startPreaperingStructlogs.type, startPreaperingStructlogsSaga),
  ])
}
