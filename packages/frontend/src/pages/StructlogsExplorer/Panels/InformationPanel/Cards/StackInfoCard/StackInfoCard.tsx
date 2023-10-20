import React from 'react'
import { useSelector } from 'react-redux'

import { StructlogAcordionPanel } from '../../../../../../components/StructlogAcordionPanel'
import { StyledTable, StyledTableCell, StyledTableRow, StyledTableValueCell } from '../styles'
import { structlogsSelectors } from '../../../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../../../store/activeStructLog/activeStructLog.selectors'

export const skipLeadingZeroes = (value: string): string => {
  return `0x${value.replace(/^0+/, '')}`
}

export const StackInfoCard = () => {
  const stack = useSelector(structlogsSelectors.selectParsedStack)
  const activeStructlog = useSelector(activeStructLogSelectors.selectActiveStructLog)

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
