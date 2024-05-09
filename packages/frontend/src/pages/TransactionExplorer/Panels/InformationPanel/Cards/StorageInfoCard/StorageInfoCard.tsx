import React from 'react'
import { Stack } from '@mui/material'
import { useSelector } from 'react-redux'

import {
  StyledRecordType,
  StyledRecordValue,
  StyledWrapper,
  StyledRecord,
  StyledCard,
  StyledCardHeading,
  StyledCardHeadingWrapper,
} from '../styles'
import { activeStructLogSelectors } from '../../../../../../store/activeStructLog/activeStructLog.selectors'

export const StorageInfoCard = () => {
  const storage = useSelector(activeStructLogSelectors.selectStructlogStorage)
  const keys = Object.keys(storage)
  const hasStorage = React.useMemo(() => keys.length > 0, [keys])

  return (
    <StyledCard>
      <StyledCardHeadingWrapper>
        <StyledCardHeading>Storage</StyledCardHeading>
      </StyledCardHeadingWrapper>
      {!hasStorage && <p>This EVM Step has no storage.</p>}
      {hasStorage && (
        <StyledWrapper>
          {keys.map((key, index) => {
            return (
              <StyledRecord key={index}>
                <StyledRecordType>{key}</StyledRecordType>
                <StyledRecordValue>{storage[key]}</StyledRecordValue>
              </StyledRecord>
            )
          })}
        </StyledWrapper>
      )}
    </StyledCard>
  )
}
