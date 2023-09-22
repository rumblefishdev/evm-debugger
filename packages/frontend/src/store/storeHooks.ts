import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import type { TAppDispatch } from './store'
import type { StoreState } from './store.types'

export const useTypedDispatch: () => TAppDispatch = useDispatch

export const useTypedSelector: TypedUseSelectorHook<StoreState> = useSelector
