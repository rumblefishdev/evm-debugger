import React from 'react'

import { selectParsedStructLogs } from '../../store/rawTxData/rawTxData.slice'
import { useTypedSelector } from '../../store/storeHooks'
import { StructLogItem } from '../StructLogItem'

import type { StructlogCardProps } from './StructlogCard.types'
import { StyledStack } from './styles'

export const StructlogCard = ({ ...props }: StructlogCardProps) => {
  const currentTraceLog = useTypedSelector((state) => state.activeBlock)
  const structLogs = useTypedSelector((state) => selectParsedStructLogs(state, currentTraceLog.startIndex, currentTraceLog.returnIndex))

  return (
    <StyledStack>
      {structLogs.map((structLog, index) => {
        return <StructLogItem key={index} structLog={structLog} />
      })}
    </StyledStack>
  )
}
