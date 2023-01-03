import React, { useRef, useEffect, useState } from 'react'

import { useTypedSelector } from '../../../store/storeHooks'
import { selectMappedTraceLogs } from '../../../store/traceLogs/mappedTraceLog.selector'
import type { TTreeMapData } from '../../../types'

import { IntrinsicItemBox } from './blocks/IntrinsicItemBox'
import { ItemBox } from './blocks/ItemBox'
import { NestedItemBox } from './blocks/NestedItemBox'
import type { ContentMapProps } from './ContentMap.types'
import { StyledCard, StyledWrapper } from './styles'

export const ContentMap = ({ ...props }: ContentMapProps) => {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setWidth(rootRef.current?.clientWidth || 0)
    setHeight(rootRef.current?.clientHeight || 0)

    // TODO: https://github.com/rumblefishdev/evm-debuger/issues/104
    // if (rootRef.current) {
    //   const element = rootRef.current
    //   const zoomFunction = (event: WheelEvent) => zoom(event, element)
    //   document.addEventListener('wheel', zoomFunction)

    //   return () => {
    //     document.removeEventListener('wheel', zoomFunction)
    //   }
    // }
  }, [])

  const traceLog = useTypedSelector((state) => selectMappedTraceLogs(state, width, height))

  const renderContent = (element: TTreeMapData) => {
    if ('owningLog' in element.item) return <IntrinsicItemBox treeMapItem={{ ...element, item: element.item }} key={element.item.id} />

    if (element.nestedItems.length > 0) return <NestedItemBox treeMapItem={{ ...element, item: element.item }} key={element.item.id} />

    return <ItemBox treeMapItem={{ ...element, item: element.item }} key={element.item.id} />
  }

  return (
    <StyledWrapper>
      <StyledCard {...props} ref={rootRef}>
        {width && height ? renderContent(traceLog) : null}
      </StyledCard>
    </StyledWrapper>
  )
}
