import { useCallback, useEffect, useState } from 'react'
import { TxAnalyzer } from '@evm-debuger/analyzer'

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
  const structLogs = useTypedSelector((state) => state.rawTxData.structLogs)

  const analyze = useCallback(() => {
    const analyzer = new TxAnalyzer({ transactionInfo, structLogs, abis: {} })
    const { mainTraceLogList, analyzeSummary } = analyzer.analyze()

    dispatch(loadTraceLogs(mainTraceLogList))
    dispatch(setContractAddresses(analyzeSummary.contractList))
    dispatch(addSighashes(analyzeSummary.contractSighashesList))
    dispatch(addBytecodes(analyzeSummary.contractList.map((address) => ({ bytecode: null, address }))))
    dispatch(addSourceCodes(analyzeSummary.contractList.map((address) => ({ sourceCode: null, address }))))

    setLoading(false)
  }, [transactionInfo, structLogs])

  useEffect(() => {
    if (transactionInfo && structLogs) analyze()
  }, [transactionInfo, structLogs])

  return { isLoading }
}
