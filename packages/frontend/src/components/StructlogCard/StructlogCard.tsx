import React, { useEffect } from 'react'
import { ViewportList } from 'react-viewport-list'

import { loadPreviousStructlog, loadNextStructlog, selectParsedStructLogs } from '../../store/activeStructlog/activeStructlog.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { StructLogItem } from '../StructLogItem'

import type { StructlogCardProps } from './StructlogCard.types'
import { StyledStack } from './styles'

export const StructlogCard = ({ ...props }: StructlogCardProps) => {
  const dispatch = useTypedDispatch()
  const structLogs = useTypedSelector(selectParsedStructLogs)

  console.log(structLogs)

  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // add keydown listener
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') dispatch(loadNextStructlog(structLogs))

      if (event.key === 'ArrowUp') dispatch(loadPreviousStructlog(structLogs))
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [structLogs])

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
