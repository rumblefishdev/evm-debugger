import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { VirtuosoHandle } from 'react-virtuoso'
import { useDebouncedCallback } from 'use-debounce'

import { bytecodesSelectors } from '../../../../store/bytecodes/bytecodes.selectors'
import { activeStructLogSelectors } from '../../../../store/activeStructLog/activeStructLog.selectors'
import { uiSelectors } from '../../../../store/ui/ui.selectors'

import type { BytecodePanelContainerProps } from './BytecodePanel.types'
import { BytecodePanelComponent } from './BytecodePanel.component'
import { StyledMissingBytecodeContainer, StyledMissingBytecodeText } from './BytecodePanel.styles'

export const BytecodePanel: React.FC<BytecodePanelContainerProps> = (props) => {
  const activeStrucLog = useSelector(activeStructLogSelectors.selectActiveStructLog)
  const currentDissasembledBytecode = useSelector(bytecodesSelectors.selectCurrentDissasembledBytecode)
  const currentStructlogListOffset = useSelector(uiSelectors.selectStructlogListOffset)
  const listRef = React.useRef<VirtuosoHandle>(null)
  const isBytecodeAvailable = Boolean(currentDissasembledBytecode)

  const currentElementIndex = useMemo(() => {
    if (!activeStrucLog || !currentDissasembledBytecode) return null
    const pcFormatted = `0x${activeStrucLog.pc.toString(16)}`
    return currentDissasembledBytecode?.[pcFormatted]?.index
  }, [activeStrucLog, currentDissasembledBytecode])

  const dissasembledBytecodeArray = useMemo(() => {
    return (currentDissasembledBytecode && Object.entries(currentDissasembledBytecode).map(([pc, item]) => item)) || []
  }, [currentDissasembledBytecode])

  const scrollToItem = useDebouncedCallback(() => {
    listRef.current.scrollToIndex({ offset: -currentStructlogListOffset, index: currentElementIndex, behavior: 'smooth' })
  }, 0)

  useEffect(() => {
    if (listRef.current && currentElementIndex) {
      scrollToItem()
    }
  }, [currentElementIndex, scrollToItem])

  if (!isBytecodeAvailable)
    return (
      <StyledMissingBytecodeContainer>
        <StyledMissingBytecodeText>Bytecode is not available for this Item. Please try again later.</StyledMissingBytecodeText>
      </StyledMissingBytecodeContainer>
    )

  return (
    <BytecodePanelComponent
      dissasembledBytecode={dissasembledBytecodeArray}
      currentElementIndex={currentElementIndex}
      ref={listRef}
      {...props}
    />
  )
}
