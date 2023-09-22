import type { ActionCreatorsMapObject } from 'redux'

import type { rootReducer } from './root.reducer'

export type StoreState = ReturnType<typeof rootReducer>

export type ActionsType<A extends ActionCreatorsMapObject> = {
  [actionName in keyof A]: ReturnType<A[actionName]>
}
