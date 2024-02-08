import type { VirtuosoHandle } from 'react-virtuoso'
import React, { useImperativeHandle } from 'react'
import { Stack } from '@mui/material'

import { StyledHeading, StyledHeadingWrapper, StyledPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { VirtualizedList } from '../../../../components/VirtualizedList/VirtualizedList'

import type { StructlogPanelComponentProps, StructlogPanelComponentRef } from './StructlogPanel.types'

export const StructlogPanelComponent = React.forwardRef<StructlogPanelComponentRef, StructlogPanelComponentProps>(
  ({ structlogs, activeStructlogIndex, handleSelect }, ref) => {
    const listRef = React.useRef<VirtuosoHandle>(null)
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      wrapperRef: wrapperRef.current,
      listRef: listRef.current,
    }))

    return (
      <StyledPanel>
        <StyledHeadingWrapper>
          <StyledHeading>EVM steps</StyledHeading>
        </StyledHeadingWrapper>
        <Stack
          width="100%"
          height="100%"
          ref={wrapperRef}
        >
          <VirtualizedList
            items={structlogs}
            ref={listRef}
          >
            {(listIndex, data) => {
              const { op, pc, index, gasCost } = data
              return (
                <ExplorerListRow
                  className="explorer-list-row"
                  id={`explorer-list-row-${listIndex}`}
                  key={listIndex}
                  displayGasIcon
                  chipValue={gasCost}
                  opCode={op}
                  pc={pc}
                  isActive={index === activeStructlogIndex}
                  onClick={() => handleSelect({ ...data, listIndex })}
                />
              )
            }}
          </VirtualizedList>
        </Stack>
      </StyledPanel>
    )
  },
)
