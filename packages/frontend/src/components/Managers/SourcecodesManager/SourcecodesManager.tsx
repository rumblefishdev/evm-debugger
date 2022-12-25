import React from 'react'

import {
  sourceCodesSelectors,
  updateSourceCode,
} from '../../../store/sourceCodes/sourceCodes.slice'
import { useTypedDispatch, useTypedSelector } from '../../../store/storeHooks'
import { ManagerItem } from '../../ManagerItem'
import { StyledStack, StyledTitle } from '../styles'

import type { SourcecodesManagerProps } from './SourcecodesManager.types'

export const SourcecodesManager = ({ ...props }: SourcecodesManagerProps) => {
  const dispatch = useTypedDispatch()
  const addSourcecode = (id: string, value: string) => {
    dispatch(updateSourceCode({ id, changes: { sourceCode: value } }))
  }

  const data = useTypedSelector((state) =>
    sourceCodesSelectors.selectAll(state.sourceCodes),
  )

  return (
    <StyledStack {...props}>
      <StyledTitle>Source Codes</StyledTitle>
      {data.map((item) => (
        <ManagerItem
          name={item.address}
          value={item.sourceCode}
          isFound={item.sourceCode !== null}
          updateItem={addSourcecode}
        />
      ))}
    </StyledStack>
  )
}
