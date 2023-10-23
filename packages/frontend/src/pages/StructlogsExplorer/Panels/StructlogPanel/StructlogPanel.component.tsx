import type { VirtuosoHandle } from 'react-virtuoso'
import React from 'react'

import { StyledHeading, StyledSmallPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { VirtualizedList } from '../../../../components/VirtualizedList/VirtualizedList'

import type { StructlogPanelComponentProps } from './StructlogPanel.types'

export const StructlogPanelComponent = React.forwardRef<VirtuosoHandle, StructlogPanelComponentProps>(
  ({ structlogs, activeStructlogIndex, handleSelect }, ref) => {
    return (
      <StyledSmallPanel>
        <StyledHeading>EVM steps</StyledHeading>
        <VirtualizedList
          items={structlogs}
          ref={ref}
        >
          {(listIndex, data) => {
            const { op, pc, index, gasCost } = data
            return (
              <ExplorerListRow
                id={`explorer-list-row-${listIndex}`}
                key={listIndex}
                chipValue={`gas: ${gasCost}`}
                opCode={op}
                pc={pc}
                isActive={index === activeStructlogIndex}
                onClick={() => handleSelect(index)}
              />
            )
          }}
        </VirtualizedList>
      </StyledSmallPanel>
    )
  },
)
