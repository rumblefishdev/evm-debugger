import { useCallback, useEffect, useState } from 'react'
import { TxAnalyzer } from '@evm-debuger/analyzer'
import type { IStructLog } from '@evm-debuger/types'

import { useTypedDispatch, useTypedSelector } from '../store/storeHooks'
import { loadTraceLogs } from '../store/traceLogs/traceLogs.slice'
import { addSighashes } from '../store/sighash/sighash.slice'
import { setContractAddresses } from '../store/rawTxData/rawTxData.slice'
import { addBytecodes } from '../store/bytecodes/bytecodes.slice'
import { addSourceCodes } from '../store/sourceCodes/sourceCodes.slice'

export const useAnalyzer = () => {
  const [isLoading, setLoading] = useState(true)

  const dispatch = useTypedDispatch()

  const transactionInfo = useTypedSelector((state) => state.rawTxData.transactionInfo)
  const structLogs = useTypedSelector((state) => state.activeStructlog.structLogs) as unknown as IStructLog[]

  const analyze = useCallback(() => {
    const analyzer = new TxAnalyzer({ transactionInfo, structLogs, abis: {} })
    const { mainTraceLogList, analyzeSummary } = analyzer.analyze()

    dispatch(loadTraceLogs(mainTraceLogList))
    dispatch(setContractAddresses(analyzeSummary.contractAddresses))
    dispatch(addSighashes(analyzeSummary.contractSighashesInfo))
    dispatch(addBytecodes(analyzeSummary.contractAddresses.map((address) => ({ bytecode: null, address }))))
    dispatch(addSourceCodes(analyzeSummary.contractAddresses.map((address) => ({ sourceCode: null, address }))))

    setLoading(false)
  }, [transactionInfo, structLogs])

  useEffect(() => {
    if (transactionInfo && structLogs) analyze()
  }, [transactionInfo, structLogs])

  return { isLoading }
}
