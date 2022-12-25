import React, { useRef, useEffect, useState } from 'react'

import { zoom } from '../../helpers/helpers'
import { useTypedSelector } from '../../store/storeHooks'
import { selectMappedTraceLogs } from '../../store/traceLogs/traceLogs.slice'
import { ItemBox } from '../ItemBox'
import { NestedItemBox } from '../NestedItemBox'

import type { ContentMapProps } from './ContentMap.types'
import { StyledCard, StyledWrapper } from './styles'

export const ContentMap = ({ ...props }: ContentMapProps) => {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setWidth(rootRef.current?.clientWidth || 0)
    setHeight(rootRef.current?.clientHeight || 0)

    if (rootRef.current) {
      const element = rootRef.current
      const zoomFunction = (event: WheelEvent) => zoom(event, element)
      document.addEventListener('wheel', zoomFunction)

      return () => {
        document.removeEventListener('wheel', zoomFunction)
      }
    }
  }, [])

  const traceLog = useTypedSelector((state) =>
    selectMappedTraceLogs(state, width, height, 24),
  )
  const { nestedItems } = traceLog

  return (
    <StyledWrapper>
      <StyledCard {...props} ref={rootRef}>
        {nestedItems && width && height ? (
          <NestedItemBox item={traceLog} />
        ) : (
          <ItemBox item={traceLog} />
        )}
      </StyledCard>
    </StyledWrapper>
  )
}
