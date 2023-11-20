import { all, takeLeading } from 'typed-redux-saga'

import { structLogsActions } from './structlogs.slice'
import { fetchStructlogsSaga } from './saga/fetchStructlogs/fetchStructlogs.saga'
import { fetchStructlogsLocationSaga } from './saga/fetchStructlogsLocation/fetchStructlogsLocation.saga'

export function* structlogsMasterSaga(): Generator {
  yield all([
    takeLeading(structLogsActions.fetchStructlogs.type, fetchStructlogsSaga),
    takeLeading(structLogsActions.fetchStructlogsLocation.type, fetchStructlogsLocationSaga),
  ])
}
