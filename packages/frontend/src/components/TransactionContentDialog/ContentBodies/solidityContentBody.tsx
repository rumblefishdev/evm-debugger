import React from 'react'
import { Stack } from '@mui/material'

import { useSources } from '../../../hooks/useSources'
import type { SolidityContentBodyProps } from '../TransactionContentDialog.types'
import { SelectMenu } from '../../SelectMenu'
import { AceEditor } from '../../AceEditor'
import { StyledDataWrapper } from '../TransactionContentDialog.styles'

export const SolidityContentBody: React.FC<SolidityContentBodyProps> = ({ content, contractName }) => {
  const sources = useSources(contractName, content)
  const defaultSourceKey =
    contractName && sources
      ? Object.keys(sources).find((key) => new RegExp(`(^|/)${contractName}.sol`, 'u').test(key))
      : sources
      ? Object.keys(sources)[0]
      : null

  const hasChoice = sources && Object.keys(sources).length > 1
  const [activeSourceKey, setActiveSourceKey] = React.useState(defaultSourceKey)

  const source = sources ? sources[activeSourceKey] : null

  return (
    <Stack
      gap={4}
      height="100%"
      width="100%"
    >
      {hasChoice && (
        <SelectMenu
          elements={Object.keys(sources)}
          selectedElement={activeSourceKey}
          selectionCallback={setActiveSourceKey}
        />
      )}
      <StyledDataWrapper>
        <AceEditor
          source={source}
          mode="solidity"
        />
      </StyledDataWrapper>
    </Stack>
  )
}
