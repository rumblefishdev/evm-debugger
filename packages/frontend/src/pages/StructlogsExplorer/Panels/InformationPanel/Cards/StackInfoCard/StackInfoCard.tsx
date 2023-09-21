import React from 'react'

import { useTypedSelector } from '../../../../../../store/storeHooks'
import { selectParsedStack } from '../../../../../../store/structlogs/structlogs.slice'
import { StructlogAcordionPanel } from '../../../../../../components/StructlogAcordionPanel'
import { StyledTable, StyledTableCell, StyledTableRow, StyledTableValueCell } from '../styles'
import { StoreKeys } from '../../../../../../store/store.keys'

export const skipLeadingZeroes = (value: string): string => {
  return `0x${value.replace(/^0+/, '')}`
}

export const StackInfoCard = () => {
  const stack = useTypedSelector(selectParsedStack)
  const activeStructlog = useTypedSelector((state) => state[StoreKeys.STRUCT_LOGS].activeStructLog)

  return (
    <StructlogAcordionPanel
      text="Stack"
      canExpand={stack.length > 0}
    >
      <StyledTable>
        <tbody>
          {stack.map((stackItem, index) => {
            const isSelected: React.CSSProperties = stackItem.value.isSelected ? { background: 'rgba(0, 0, 0, 0.04)' } : {}

            const argName = activeStructlog.args[index]

            const name = argName?.name ? `${argName.name}` : stackItem.index

            return (
              <StyledTableRow
                sx={isSelected}
                key={index}
              >
                <StyledTableCell>{name}</StyledTableCell>
                <StyledTableValueCell>{skipLeadingZeroes(stackItem.value.value)}</StyledTableValueCell>
              </StyledTableRow>
            )
          })}
        </tbody>
      </StyledTable>
    </StructlogAcordionPanel>
  )
}
