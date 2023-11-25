import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import React from 'react'

import { analyzerActions } from '../../store/analyzer/analyzer.slice'
import { ROUTES } from '../../routes'

import type { NewTransactionButtonProps } from './NewTransactionButton.types'
import { NewTransactionButtonComponent } from './NewTransactionButton.component'

export const NewTransactionButton: React.FC<NewTransactionButtonProps> = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const startNewTransaction = React.useCallback(() => {
    dispatch(analyzerActions.resetAnalyzer())
    navigate(ROUTES.HOME)
  }, [navigate, dispatch])

  return (
    <NewTransactionButtonComponent
      onClick={startNewTransaction}
      {...props}
    />
  )
}
