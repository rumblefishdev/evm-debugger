import { useCallback, useEffect, useState } from 'react'
import { TxAnalyzer } from '@evm-debuger/analyzer'

import { useTypedDispatch, useTypedSelector } from '../store/storeHooks'
import { loadTraceLogs } from '../store/traceLogs/traceLogs.slice'

export const useAnalyzer = () => {
  const [isLoading, setLoading] = useState(true)

  const dispatch = useTypedDispatch()

  const transactionInfo = useTypedSelector((state) => state.rawTxData.transactionInfo)
  const structLogs = useTypedSelector((state) => state.rawTxData.structLogs)

  const analyze = useCallback(() => {
    const analyzer = new TxAnalyzer({ transactionInfo, structLogs })
    const result = analyzer.baseAnalyze()

    dispatch(loadTraceLogs(result))
    setLoading(false)
  }, [transactionInfo, structLogs])

  useEffect(() => {
    if (transactionInfo && structLogs) analyze()
  }, [transactionInfo, structLogs])

  return { isLoading }
}
