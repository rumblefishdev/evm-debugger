import React, { useEffect } from 'react'
import ViewportList from 'react-viewport-list'
import type { ViewportListRef } from 'react-viewport-list'
import { ethers } from 'ethers'

import { useTypedSelector } from '../../../../store/storeHooks'
import { bytecodesSelectors } from '../../../../store/bytecodes/bytecodes.slice'
import { StyledHeading, StyledListWrapper, StyledSmallPanel, StyledButton } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { convertOpcodeToName } from '../../../../helpers/opcodesDictionary'
import { sourceCodesSelectors } from '../../../../store/sourceCodes/sourceCodes.slice'
import { isInView } from '../../../../helpers/dom'
import { StoreKeys } from '../../../../store/store.keys'

import { StyledDisabledBytecode } from './styles'
import { SourceCodePanel } from './SourceCodePanel'

export const BytecodePanel = (): JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<ViewportListRef>(null)

  const [isSourceView, setSourceView] = React.useState(false)
  const toggleSourceView = () => setSourceView((prev) => !prev)

  const activeBlock = useTypedSelector((state) => state.activeBlock)
  const sourceCode = useTypedSelector((state) => sourceCodesSelectors.selectById(state.sourceCodes, activeBlock.address))?.sourceCode

  const activeStrucLog = useTypedSelector((state) => state[StoreKeys.STRUCT_LOGS].activeStructLog)
  const currentAddress = activeBlock.address
  const activeBlockBytecode = useTypedSelector((state) => bytecodesSelectors.selectById(state.bytecodes, currentAddress))

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

  if (isSourceView)
    return (
      <SourceCodePanel
        close={toggleSourceView}
        sourceCode={sourceCode}
      />
    )

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
        {sourceCode ? (
          <StyledButton
            variant="text"
            onClick={toggleSourceView}
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
