import React from 'react'

import { useAnalyzer } from '../../hooks/useAnalyzer'
import { useTypedSelector } from '../../store/storeHooks'
import { sourceCodesSelectors } from '../../store/sourceCodes/sourceCodes.slice'
import { bytecodesSelectors } from '../../store/bytecodes/bytecodes.slice'
import { sighashSelectors } from '../../store/sighash/sighash.slice'

import type { AnalyzeSummaryProps } from './AnalyzeSummary.types'
import { StyledStack } from './styles'

export const AnalyzeSummary = ({ ...props }: AnalyzeSummaryProps) => {
  const { isLoading } = useAnalyzer()

  const contractAddresses = useTypedSelector((state) => state.rawTxData.contractAddresses)
  const byteCodes = useTypedSelector((state) => bytecodesSelectors.selectAll(state.bytecodes))
  const sourceCodes = useTypedSelector((state) => sourceCodesSelectors.selectAll(state.sourceCodes))
  const sighashes = useTypedSelector((state) => sighashSelectors.selectAll(state.sighashes))

  console.log({ sourceCodes, sighashes, contractAddresses, byteCodes })

  return isLoading ? null : <StyledStack {...props}></StyledStack>
}
