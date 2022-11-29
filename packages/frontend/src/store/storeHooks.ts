import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import type { TRootState, TAppDispatch } from './store'

export const useTypedDispatch: () => TAppDispatch = useDispatch
export const useTypedSelector: TypedUseSelectorHook<TRootState> = useSelector
