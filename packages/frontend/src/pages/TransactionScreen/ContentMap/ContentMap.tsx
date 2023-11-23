import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import type { TTreeMapData } from '../../../types'
import { traceLogsSelectors } from '../../../store/traceLogs/traceLogs.selectors'

import { IntrinsicItemBox } from './blocks/IntrinsicItemBox'
import { ItemBox } from './blocks/ItemBox'
import { NestedItemBox } from './blocks/NestedItemBox'
import type { ContentMapProps } from './ContentMap.types'
import { StyledCard, StyledWrapper } from './styles'
import { generateTraceLogsMap } from './ContentMap.utils'

export const ContentMap = ({ ...props }: ContentMapProps) => {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (rootRef.current && rootRef.current.clientWidth !== width && rootRef.current.clientHeight !== height) {
        setWidth(rootRef.current?.clientWidth)
        setHeight(rootRef.current?.clientHeight)
      }
    }, 200)

    return () => {
      clearInterval(intervalId)
    }

    // TODO: https://github.com/rumblefishdev/evm-debuger/issues/104
    // if (rootRef.current) {
    //   const element = rootRef.current
    //   const zoomFunction = (event: WheelEvent) => zoom(event, element)
    //   document.addEventListener('wheel', zoomFunction)

    //   return () => {
    //     document.removeEventListener('wheel', zoomFunction)
    //   }
    // }
  }, [rootRef, width, height])

  const traceLogs = useSelector(traceLogsSelectors.selectAll)

  const mappedTraceLogs = React.useMemo(() => generateTraceLogsMap(traceLogs, { width, height }), [traceLogs, width, height])

  const renderContent = (element: TTreeMapData) => {
    if ('owningLog' in element.item)
      return (
        <IntrinsicItemBox
          treeMapItem={{ ...element, item: element.item }}
          key={element.item.id}
        />
      )

    if (element.nestedItems.length > 0)
      return (
        <NestedItemBox
          treeMapItem={{ ...element, item: element.item }}
          key={element.item.id}
        />
      )

    return (
      <ItemBox
        treeMapItem={{ ...element, item: element.item }}
        key={element.item.id}
      />
    )
  }

  return (
    <StyledWrapper>
      <StyledCard
        ref={rootRef}
        {...props}
      >
        {/* {width && height ? renderContent(traceLog) : null} */}
        {renderContent(mappedTraceLogs)}
        {/* <div style={{ width: '100%', height, background: 'blue' }}></div> */}
      </StyledCard>
    </StyledWrapper>
  )
}
