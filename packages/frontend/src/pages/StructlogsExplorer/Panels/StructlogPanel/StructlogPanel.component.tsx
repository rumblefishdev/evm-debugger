import { StyledHeading, StyledSmallPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { VirtualizedList } from '../../../../components/VirtualizedList/VirtualizedList'

import type { StructlogPanelComponentProps } from './StructlogPanel.types'

export const StructlogPanelComponent: React.FC<StructlogPanelComponentProps> = ({ structlogs, activeStructlogIndex, handleSelect }) => {
  return (
    <StyledSmallPanel>
      <StyledHeading>EVM steps</StyledHeading>
      <VirtualizedList items={structlogs}>
        {(listIndex, data) => {
          const { op, pc, index, gasCost } = data
          return (
            <ExplorerListRow
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
}
