import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { bytecodesSelectors } from '../../../../store/bytecodes/bytecodes.selectors'
import { structlogsSelectors } from '../../../../store/structlogs/structlogs.selectors'
import { isInView } from '../../../../helpers/dom'

import type { BytecodePanelContainerProps } from './BytecodePanel.types'
import { BytecodePanelComponent } from './BytecodePanel.component'
import { StyledMissingBytecodeContainer, StyledMissingBytecodeText } from './BytecodePanel.styles'

export const BytecodePanel: React.FC<BytecodePanelContainerProps> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const activeStrucLog = useSelector(structlogsSelectors.selectActiveStructLog)
  const currentDissasembledBytecode = useSelector(bytecodesSelectors.selectCurrentDissasembledBytecode)

  const isBytecodeAvailable = Boolean(currentDissasembledBytecode)

  useEffect(() => {
    if (activeStrucLog && isBytecodeAvailable) {
      const pcFormatted = `0x${activeStrucLog.pc.toString(16)}`
      const currentElementIndex = currentDissasembledBytecode[pcFormatted].index
      const element = document.querySelector(`#bytecodeItem_${currentElementIndex}`) as HTMLElement

      if ((!element || !isInView(element)) && ref.current) {
        const { scrollTop, clientHeight } = ref.current
        const offset = currentElementIndex * 73

        const target = offset > scrollTop ? offset - clientHeight + 84 : offset - 20

        ref.current.scrollTo({ top: target, behavior: 'smooth' })
      }
    }
  }, [activeStrucLog, currentDissasembledBytecode, isBytecodeAvailable])

  const dissasembledBytecodeArray = useMemo(() => {
    return (currentDissasembledBytecode && Object.entries(currentDissasembledBytecode).map(([pc, item]) => item)) || []
  }, [currentDissasembledBytecode])

  if (!isBytecodeAvailable)
    return (
      <StyledMissingBytecodeContainer>
        <StyledMissingBytecodeText>Bytecode is not available for this Item. Please try again later.</StyledMissingBytecodeText>
      </StyledMissingBytecodeContainer>
    )

  return (
    <BytecodePanelComponent
      dissasembledBytecode={dissasembledBytecodeArray}
      activeStructlogPc={activeStrucLog?.pc}
      ref={ref}
      {...props}
    />
  )
}
