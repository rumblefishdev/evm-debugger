import React from 'react'
import { useSelector } from 'react-redux'
import type { VirtuosoHandle } from 'react-virtuoso'

import { yulNodesSelectors } from '../../../../../store/yulNodes/yulNodes.selectors'

import { YulNodesViewComponent } from './YulNodesView.component'

export const YulNodesViewContainer: React.FC = () => {
  const currentYulNodesWithListIndex = useSelector(yulNodesSelectors.selectCurrentBaseYulNodesWithExtendedData)
  const activeYulNode = useSelector(yulNodesSelectors.selectActiveYulNode)

  const listRef = React.useRef<VirtuosoHandle>(null)

  React.useEffect(() => {
    if (activeYulNode && listRef.current) {
      setTimeout(() => {
        listRef.current.scrollTo({ top: activeYulNode.listIndex * 50.75, behavior: 'smooth' })
      }, 50)
    }
  }, [activeYulNode, listRef])

  return (
    <YulNodesViewComponent
      yulNodes={currentYulNodesWithListIndex}
      activeYulNode={activeYulNode}
      ref={listRef}
    />
  )
}
