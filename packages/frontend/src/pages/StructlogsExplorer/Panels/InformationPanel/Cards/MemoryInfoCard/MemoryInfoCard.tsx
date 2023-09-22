import React from 'react'
import { useSelector } from 'react-redux'

import { StructlogAcordionPanel } from '../../../../../../components/StructlogAcordionPanel'
import { StyledRecordType, StyledRecordValue, StyledWrapper, StyledRecord } from '../styles'
import { skipLeadingZeroes } from '../StackInfoCard/StackInfoCard'
import { palette } from '../../../../../../importedComponents/theme/algaeTheme/palette'
import { structlogsSelectors } from '../../../../../../store/structlogs/structlogs.selectors'

import type { MemoryInfoCardProps } from './MemoryInfoCard.types'

export const MemoryInfoCard = ({ ...props }: MemoryInfoCardProps) => {
  const memory = useSelector(structlogsSelectors.selectParsedMemory)
  const activeStructlog = useSelector(structlogsSelectors.selectActiveStructLog)

  const decorateBytes = (offset: string, index: number): React.CSSProperties => {
    let cssProperties: React.CSSProperties = {}
    const underlineCss: React.CSSProperties = {
      borderBottom: `1px solid ${palette.colorLink}`,
    }
    const highLightCss: React.CSSProperties = {
      color: palette.colorWhite,
      background: palette.colorBrand.secondary,
    }
    const params = Object.fromEntries(activeStructlog.args.map((v) => [v.name, v.value]))
    switch (activeStructlog.op) {
      case 'MSTORE':
      case 'MLOAD': {
        if (params.offset) {
          const highlightFrom = Number.parseInt(skipLeadingZeroes(params.offset), 16)
          const highlightTo = highlightFrom + 32
          const currElem = Number.parseInt(skipLeadingZeroes(offset), 16) + index
          if (currElem >= highlightFrom && currElem < highlightTo) cssProperties = highLightCss
        }
        break
      }
      case 'CREATE':
      case 'CREATE2':
      case 'REVERT':
      case 'RETURN': {
        if (params.offset) {
          const highlightFrom = Number.parseInt(skipLeadingZeroes(params.offset), 16)
          const highlightTo = highlightFrom + Number.parseInt(skipLeadingZeroes(params['length'] || params['size']), 16)
          const currElem = Number.parseInt(skipLeadingZeroes(offset), 16) + index
          if (currElem >= highlightFrom && currElem < highlightTo) cssProperties = highLightCss
        }
        break
      }
      case 'DELEGATECALL':
      case 'STATICCALL':
      case 'CALL': {
        const currElem = Number.parseInt(skipLeadingZeroes(offset), 16) + index
        if (params.argsOffset && params.inSize) {
          const highlightFrom = Number.parseInt(skipLeadingZeroes(params.inSize), 16)
          const highlightTo = highlightFrom + Number.parseInt(skipLeadingZeroes(params.inSize), 16)
          if (currElem >= highlightFrom && currElem < highlightTo) cssProperties = highLightCss
        }
        if (params.retOffset && params.outSize) {
          const underlineFrom = Number.parseInt(skipLeadingZeroes(params.retOffset), 16)
          const underlineTo = underlineFrom + Number.parseInt(skipLeadingZeroes(params.outSize), 16)
          if (currElem >= underlineFrom && currElem < underlineTo) cssProperties = { ...cssProperties, ...underlineCss }
        }
        break
      }
      default: {
        break
      }
    }
    return cssProperties
  }
  return (
    <StructlogAcordionPanel
      text="Memory"
      canExpand={memory.length > 0}
    >
      <StyledWrapper {...props}>
        {memory.map((memoryItem) => {
          return (
            <StyledRecord
              direction="row"
              key={memoryItem.index}
            >
              <StyledRecordType>{memoryItem.index}</StyledRecordType>
              {memoryItem.value.map((value, index) => {
                return (
                  <StyledRecordValue key={index}>
                    <span style={decorateBytes(memoryItem.index, index)}>{value}</span>
                  </StyledRecordValue>
                )
              })}
            </StyledRecord>
          )
        })}
      </StyledWrapper>
    </StructlogAcordionPanel>
  )
}
