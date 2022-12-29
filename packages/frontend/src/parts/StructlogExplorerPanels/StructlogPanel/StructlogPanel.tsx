import React, { useEffect } from 'react'
import { ViewportList } from 'react-viewport-list'

import { loadPreviousStructlog, loadNextStructlog, selectParsedStructLogs } from '../../../store/structlogs/structlogs.slice'
import { useTypedDispatch, useTypedSelector } from '../../../store/storeHooks'
import { StyledHeading, StyledListWrapper, StyledSmallPanel } from '../styles'

import { StructLogItem } from './StructLogItem'

export const StructlogPanel = (): JSX.Element => {
  const dispatch = useTypedDispatch()
  const structLogs = useTypedSelector(selectParsedStructLogs)

  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // event.preventDefault() won't stop scrolling via arrow keys when is fired in if statement
      event.preventDefault()
      if (event.key === 'ArrowDown' && !event.repeat) dispatch(loadNextStructlog(structLogs))

      if (event.key === 'ArrowUp' && !event.repeat) dispatch(loadPreviousStructlog(structLogs))
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [structLogs])

  return (
    <StyledSmallPanel ref={ref}>
      <StyledHeading>EVM steps</StyledHeading>
      <StyledListWrapper>
        <ViewportList viewportRef={ref} items={structLogs} withCache={true}>
          {(item, index) => {
            return <StructLogItem key={index} structLog={item} />
          }}
        </ViewportList>
      </StyledListWrapper>
    </StyledSmallPanel>
  )
}
