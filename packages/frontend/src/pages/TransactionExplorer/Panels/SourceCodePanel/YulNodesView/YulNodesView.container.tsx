import React from 'react'
import { useSelector } from 'react-redux'
import type { VirtuosoHandle } from 'react-virtuoso'

import { yulNodesSelectors } from '../../../../../store/yulNodes/yulNodes.selectors'

import { YulNodesViewComponent } from './YulNodesView.component'

export const YulNodesViewContainer: React.FC = () => {
  const currentYulNodes = useSelector(yulNodesSelectors.selectCurrentYulNodes)
  const activeYulNode = useSelector(yulNodesSelectors.selectActiveYulNode)

  console.log('currentYulNodes', currentYulNodes)
  console.log('activeYulNode', activeYulNode)

  const listRef = React.useRef<VirtuosoHandle>(null)

  React.useEffect(() => {
    console.log('activeYulNode', activeYulNode)
    console.log('listRef', listRef)
    if (activeYulNode && listRef.current) {
      setTimeout(() => {
        listRef.current.scrollTo({ top: activeYulNode.listIndex * 47.6, behavior: 'smooth' })
      }, 50)
    }
  }, [activeYulNode, listRef])

  return (
    <YulNodesViewComponent
      yulNodes={currentYulNodes}
      activeYulNode={activeYulNode}
      ref={listRef}
    />
  )
}
