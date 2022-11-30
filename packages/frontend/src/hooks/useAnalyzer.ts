import { useCallback, useEffect, useState } from 'react'
import { TxAnalyzer } from '@evm-debuger/analyzer'
import type { TDataProvider, TTransactionTraceResult } from '@evm-debuger/types'

import { useTypedDispatch, useTypedSelector } from '../store/storeHooks'
import { loadTraceLogs } from '../store/traceLogs/traceLogs.slice'

export const useAnalyzer = () => {
    const [isLoading, setLoading] = useState(true)

    const dispatch = useTypedDispatch()

    const txInfo = useTypedSelector((state) => state.rawTxData.transactionInfo)
    const structLogs = useTypedSelector((state) => state.rawTxData.structLogs)

    const analyze = useCallback(async () => {
        const dataProvider = {
            getTransactionTrace: () => {
                return Promise.resolve({ structLogs } as TTransactionTraceResult)
            },
            getTransactionByHash: () => {
                return Promise.resolve(txInfo)
            },
        } as unknown as TDataProvider
        const analyzer = new TxAnalyzer(dataProvider, '')
        const result = await analyzer.baseAnalyze()

        dispatch(loadTraceLogs(result))
        setLoading(false)
    }, [txInfo, structLogs])

    useEffect(() => {
        if (txInfo && structLogs) analyze()
    }, [txInfo, structLogs])

    return { isLoading }
}
