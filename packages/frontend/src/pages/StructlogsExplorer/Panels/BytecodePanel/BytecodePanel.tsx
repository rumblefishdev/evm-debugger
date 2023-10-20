import React, { useEffect } from 'react'
import ViewportList from 'react-viewport-list'
import type { ViewportListRef } from 'react-viewport-list'
import { ethers } from 'ethers'
import { useSelector } from 'react-redux'

import { useTypedSelector } from '../../../../store/storeHooks'
import { StyledHeading, StyledListWrapper, StyledSmallPanel, StyledButton } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { convertOpcodeToName } from '../../../../helpers/opcodesDictionary'
import { isInView } from '../../../../helpers/dom'
import { activeBlockSelectors } from '../../../../store/activeBlock/activeBlock.selector'
import { bytecodesSelectors } from '../../../../store/bytecodes/bytecodes.selectors'
import { activeStructLogSelectors } from '../../../../store/activeStructLog/activeStructLog.selectors'

import { StyledDisabledBytecode } from './styles'
import type { BytecodePanelProps } from './BytecodePanel.types'

export const BytecodePanel: React.FC<BytecodePanelProps> = ({ isAbleToDisplaySourceCodePanel, toggleSourceCodePanel }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<ViewportListRef>(null)

  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)
  const currentBlockAddress = activeBlock.address

  const activeStrucLog = useSelector(activeStructLogSelectors.selectActiveStructLog)
  const activeBlockBytecode = useTypedSelector((state) => bytecodesSelectors.selectByAddress(state, currentBlockAddress))

  useEffect(() => {
    if (!activeBlockBytecode?.disassembled) return
    if (activeStrucLog) {
      const pcFormatted = `0x${activeStrucLog.pc.toString(16)}`
      const index = activeBlockBytecode.disassembled.findIndex((opcode) => opcode.pc === pcFormatted)
      if (typeof index === 'number') {
        const element = document.querySelector(`#bytecodeItem_${index}`) as HTMLElement

        if ((!element || !isInView(element)) && ref.current) {
          const { scrollTop, clientHeight } = ref.current
          const offset = index * 64

          const target = offset > scrollTop ? offset - clientHeight + 84 : offset - 20

          ref.current.scrollTo({ top: target, behavior: 'smooth' })
        }
      }
    }
  }, [activeStrucLog, activeBlockBytecode.disassembled])

  if (!activeBlockBytecode?.disassembled)
    return (
      <StyledSmallPanel>
        <StyledDisabledBytecode>Bytecode is not available for this Item. Please try again later.</StyledDisabledBytecode>
      </StyledSmallPanel>
    )

  return (
    <StyledSmallPanel>
      <StyledHeading>
        Disassembled Bytecode
        {isAbleToDisplaySourceCodePanel ? (
          <StyledButton
            variant="text"
            onClick={toggleSourceCodePanel}
          >
            View source
          </StyledButton>
        ) : null}
      </StyledHeading>
      <StyledListWrapper ref={ref}>
        <ViewportList
          ref={listRef}
          viewportRef={ref}
          items={activeBlockBytecode.disassembled}
          withCache={true}
        >
          {(item, index) => {
            const { opcode, operand, pc } = item
            const isActive = activeStrucLog?.pc === ethers.BigNumber.from(pc).toNumber()
            return (
              <ExplorerListRow
                id={`bytecodeItem_${index}`}
                key={pc}
                chipValue={operand}
                isActive={isActive}
                opCode={convertOpcodeToName(opcode)}
                pc={pc}
              />
            )
          }}
        </ViewportList>
      </StyledListWrapper>
    </StyledSmallPanel>
  )
}
