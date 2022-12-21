import React from 'react'
import { ViewportList } from 'react-viewport-list'

import { selectParsedStructLogs } from '../../store/rawTxData/rawTxData.slice'
import { useTypedSelector } from '../../store/storeHooks'
import { StructLogItem } from '../StructLogItem'

import type { StructlogCardProps } from './StructlogCard.types'
import { StyledStack } from './styles'

export const StructlogCard = ({ ...props }: StructlogCardProps) => {
  const structLogs = useTypedSelector(selectParsedStructLogs)

  const ref = React.useRef<HTMLDivElement>(null)

  return (
    <StyledStack ref={ref}>
      <ViewportList viewportRef={ref} items={structLogs}>
        {(item, index) => {
          return <StructLogItem key={index} structLog={item} />
        }}
      </ViewportList>
    </StyledStack>
  )
}
