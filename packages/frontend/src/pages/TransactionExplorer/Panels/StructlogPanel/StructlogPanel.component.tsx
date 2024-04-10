import type { VirtuosoHandle } from 'react-virtuoso'
import React, { useImperativeHandle } from 'react'
import { Stack, Typography } from '@mui/material'

import { StyledHeading, StyledHeadingWrapper, StyledPanel } from '../styles'
import { EvmStepListElement } from '../../../../components/EvmStepListElement'
import { VirtualizedList } from '../../../../components/VirtualizedList/VirtualizedList'

import type { StructlogPanelComponentProps, StructlogPanelComponentRef } from './StructlogPanel.types'

export const StructlogPanelComponent = React.forwardRef<StructlogPanelComponentRef, StructlogPanelComponentProps>(
  ({ structlogs, activeStructlog, handleSelect, disassembledBytecode }, ref) => {
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
          <Typography
            variant="label"
            fontSize={18}
          >
            Gas left: <b>{activeStructlog.gas}</b>
          </Typography>
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
              const { op, pc, index, dynamicGasCost, gasCost } = data
              return (
                <EvmStepListElement
                  pushValue={disassembledBytecode[pc]?.value}
                  className="explorer-list-row"
                  id={`explorer-list-row-${listIndex}`}
                  key={listIndex}
                  baseGasCost={gasCost}
                  dynamicGasCost={dynamicGasCost}
                  opCode={op}
                  pc={pc}
                  isActive={index === activeStructlog?.index}
                  onClick={() => handleSelect(data)}
                />
              )
            }}
          </VirtualizedList>
        </Stack>
      </StyledPanel>
    )
  },
)
