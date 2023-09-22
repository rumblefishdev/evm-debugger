import type { SelectChangeEvent } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useCallback, useEffect, useId, useMemo, useState } from 'react'

import { useTypedSelector } from '../../store/storeHooks'
import type { RawDataDisplayerProps } from '../RawDataDisplayer/RawDataDisplayer.types'
import { StyledDataWrapper, StyledDescription, StyledDialog, StyledHeader, StyledStack, StyledTitle } from '../RawDataDisplayer/styles'
import { contractNamesSelectors } from '../../store/contractNames/contractNames.selectors'

import { StyledSelectWrapper, StyledSyntaxHighlighter } from './styles'

export function useSources(data?: string) {
  return useMemo(() => {
    if (!data) return {}

    const parsed: Record<string, { content: string }> | null =
      data.startsWith('{"') && !/\n/u.test(data)
        ? JSON.parse(data)
        : data.startsWith('{{') && data.endsWith('}}')
        ? (
            JSON.parse(data.slice(1, -1)) as {
              sources: Record<string, { content: string }>
            }
          ).sources
        : null

    if (parsed) return parsed ? Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, value.content])) : { '': data }
  }, [data])
}

export const SourceCodeDisplayer = ({ data, title, address, description, ...props }: RawDataDisplayerProps) => {
  const { contractName } = useTypedSelector((state) => contractNamesSelectors.selectByAddress(state, address))

  const inputId = useId()

  const sources = useSources(data)
  const defaultSourceKey =
    contractName && sources
      ? Object.keys(sources).find((key) => new RegExp(`(^|/)${contractName}.sol`, 'u').test(key))
      : sources
      ? Object.keys(sources)[0]
      : null

  const hasChoice = sources && Object.keys(sources).length > 1
  const [activeSourceKey, setActiveSourceKey] = useState(defaultSourceKey)

  useEffect(() => {
    if (!props.open) {
      const timeout = setTimeout(() => {
        setActiveSourceKey(defaultSourceKey)
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [props.open, defaultSourceKey])

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setActiveSourceKey(event.target.value)
  }, [])

  const source = sources ? sources[activeSourceKey] : null

  return (
    <StyledDialog {...props}>
      <StyledStack>
        <StyledHeader>
          <StyledTitle>Result for {title}</StyledTitle>
          {description ? <StyledDescription>{description}</StyledDescription> : null}
        </StyledHeader>

        {hasChoice && (
          <StyledSelectWrapper>
            <FormControl fullWidth>
              <InputLabel id={inputId}>File</InputLabel>
              <Select
                label="File"
                labelId={inputId}
                value={activeSourceKey}
                onChange={handleChange}
              >
                {Object.keys(sources).map((key) => (
                  <MenuItem
                    key={key}
                    value={key}
                  >
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </StyledSelectWrapper>
        )}
        <StyledDataWrapper>
          <StyledSyntaxHighlighter source={source} />
        </StyledDataWrapper>
      </StyledStack>
    </StyledDialog>
  )
}
