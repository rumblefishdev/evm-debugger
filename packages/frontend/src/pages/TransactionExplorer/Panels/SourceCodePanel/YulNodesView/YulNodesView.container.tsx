import React from 'react'
import { useSelector } from 'react-redux'
import type { VirtuosoHandle } from 'react-virtuoso'

import { yulNodesSelectors } from '../../../../../store/yulNodes/yulNodes.selectors'

import { YulNodesViewComponent } from './YulNodesView.component'

export const YulNodesViewContainer: React.FC = () => {
  const currentYulNodesWithListIndex = useSelector(yulNodesSelectors.selectCurrentBaseYulNodesWithExtendedData)
  const activeYulNode = useSelector(yulNodesSelectors.selectActiveYulNode)
  const activeYulNodeElement = useSelector(yulNodesSelectors.selectActiveYulNodeElement)

  const listRef = React.useRef<VirtuosoHandle>(null)

  // React.useEffect(() => {
  //   if (activeYulNodeElement && listRef.current) {
  //     setTimeout(() => {
  //       listRef.current.scrollTo({ top: activeYulNodeElement.listIndex * 54, behavior: 'smooth' })
  //     }, 50)
  //   }
  // }, [activeYulNodeElement, listRef])

  return (
    <YulNodesViewComponent
      yulNodes={currentYulNodesWithListIndex}
      activeYulNode={activeYulNode}
      activeYulNodeElement={activeYulNodeElement}
      ref={listRef}
    />
  )
}
