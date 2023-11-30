import React from 'react'
import { useSelector } from 'react-redux'

import { StructlogAcordionPanel } from '../../../../../../components/StructlogAcordionPanel'
import { StyledRecordType, StyledRecordValue, StyledWrapper, StyledRecord } from '../styles'
import { skipLeadingZeroes } from '../StackInfoCard/StackInfoCard'
import { palette } from '../../../../../../importedComponents/theme/algaeTheme/palette'
import { DEFAULT_STRING, activeStructLogSelectors } from '../../../../../../store/activeStructLog/activeStructLog.selectors'

import type { MemoryInfoCardProps } from './MemoryInfoCard.types'

export const MemoryInfoCard = ({ ...props }: MemoryInfoCardProps) => {
  const memory = useSelector(activeStructLogSelectors.selectParsedMemory)
  const activeStructlog = useSelector(activeStructLogSelectors.selectActiveStructLog)
  const structLogParams = React.useMemo(() => {
    if (!activeStructlog) return null
    return Object.fromEntries(activeStructlog.args.map((v) => [v.name, v.value]))
  }, [activeStructlog])

  const memoryIndexPadded = React.useMemo(() => {
    if (!structLogParams?.offset) return null
    return structLogParams.offset.replace(/^0+/, '').padStart(DEFAULT_STRING.length, '0')
  }, [structLogParams])

  const decorateBytes = (offset: string, index: number): React.CSSProperties => {
    let cssProperties: React.CSSProperties = {}
    const underlineCss: React.CSSProperties = {
      borderBottom: `1px solid ${palette.colorLink}`,
    }
    const highLightCss: React.CSSProperties = {
      color: palette.colorWhite,
      background: palette.colorBrand.secondary,
    }

    switch (activeStructlog.op) {
      case 'MSTORE':
      case 'MLOAD': {
        if (structLogParams.offset) {
          const highlightFrom = Number.parseInt(skipLeadingZeroes(structLogParams.offset), 16)
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
        if (structLogParams.offset) {
          const highlightFrom = Number.parseInt(skipLeadingZeroes(structLogParams.offset), 16)
          const highlightTo = highlightFrom + Number.parseInt(skipLeadingZeroes(structLogParams['length'] || structLogParams['size']), 16)
          const currElem = Number.parseInt(skipLeadingZeroes(offset), 16) + index
          if (currElem >= highlightFrom && currElem < highlightTo) cssProperties = highLightCss
        }
        break
      }
      case 'DELEGATECALL':
      case 'STATICCALL':
      case 'CALL': {
        const currElem = Number.parseInt(skipLeadingZeroes(offset), 16) + index
        if (structLogParams.argsOffset && structLogParams.inSize) {
          const highlightFrom = Number.parseInt(skipLeadingZeroes(structLogParams.inSize), 16)
          const highlightTo = highlightFrom + Number.parseInt(skipLeadingZeroes(structLogParams.inSize), 16)
          if (currElem >= highlightFrom && currElem < highlightTo) cssProperties = highLightCss
        }
        if (structLogParams.retOffset && structLogParams.outSize) {
          const underlineFrom = Number.parseInt(skipLeadingZeroes(structLogParams.retOffset), 16)
          const underlineTo = underlineFrom + Number.parseInt(skipLeadingZeroes(structLogParams.outSize), 16)
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
          if (memoryIndexPadded && memoryItem.index === memoryIndexPadded) {
            return (
              <StyledRecord
                direction="row"
                key={memoryItem.index}
              >
                <StyledRecordType>{memoryItem.index}</StyledRecordType>
                <StyledRecordValue>
                  {memoryItem.value.match(/.{1,2}/g).map((value, index) => {
                    return (
                      <span
                        key={index}
                        style={decorateBytes(memoryItem.index, index)}
                      >
                        {value}
                      </span>
                    )
                  })}
                </StyledRecordValue>
              </StyledRecord>
            )
          }
          return (
            <StyledRecord
              direction="row"
              key={memoryItem.index}
            >
              <StyledRecordType>{memoryItem.index}</StyledRecordType>
              <StyledRecordValue>{memoryItem.value}</StyledRecordValue>
            </StyledRecord>
          )
        })}
      </StyledWrapper>
    </StructlogAcordionPanel>
  )
}
