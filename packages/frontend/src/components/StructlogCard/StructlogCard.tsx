import React, { useEffect } from 'react'
import { ViewportList } from 'react-viewport-list'

import {
  loadPreviousStructlog,
  loadNextStructlog,
  selectParsedStructLogs,
} from '../../store/structlogs/structlogs.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { StructLogItem } from '../StructLogItem'

import type { StructlogCardProps } from './StructlogCard.types'
import { StyledStack } from './styles'

export const StructlogCard = ({ ...props }: StructlogCardProps) => {
  const dispatch = useTypedDispatch()
  const structLogs = useTypedSelector(selectParsedStructLogs)

  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()

      if (event.key === 'ArrowDown' && !event.repeat)
        dispatch(loadNextStructlog(structLogs))

      if (event.key === 'ArrowUp' && !event.repeat)
        dispatch(loadPreviousStructlog(structLogs))
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [structLogs])

  return (
    <StyledStack ref={ref} {...props}>
      <ViewportList viewportRef={ref} items={structLogs} withCache={true}>
        {(item, index) => {
          return <StructLogItem key={index} structLog={item} />
        }}
      </ViewportList>
    </StyledStack>
  )
}
