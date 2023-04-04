import type { SelectChangeEvent } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

import type { RawDataDisplayerProps } from '../RawDataDisplayer/RawDataDisplayer.types'
import {
  StyledDataIndex,
  StyledDataIndexesWrapper,
  StyledDataWrapper,
  StyledDescription,
  StyledDialog,
  StyledHeader,
  StyledStack,
  StyledTitle,
} from '../RawDataDisplayer/styles'

import {
  StyledLoading,
  StyledSelectWrapper,
  StyledSyntaxHighlighter,
} from './styles'

export const SourceCodeDisplayer = ({
  data,
  title,
  description,
  ...props
}: RawDataDisplayerProps) => {
  const inputId = useId()

  const sources = useMemo(() => {
    if (data.startsWith('{{') && data.endsWith('}}')) {
      const { sources: parsed } = JSON.parse(data.slice(1, -1)) as {
        sources: Record<string, { content: string }>
      }
      return Object.fromEntries(
        Object.entries(parsed).map(([key, value]) => [key, value.content]),
      )
    }
    return { '': data }
  }, [data])

  const hasChoice = Object.keys(sources).length > 1
  const [activeSourceKey, setActiveSourceKey] = useState(
    Object.keys(sources)[0],
  )
  const [isLoading, setIsLoading] = useState(true)

  const sizeRef = useRef<HTMLDivElement>(null)
  const [prevSize, setPrevSize] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (props.open && isLoading) {
      const timeout = setTimeout(() => setIsLoading(false), 100)
      return () => clearTimeout(timeout)
    }
    if (!props.open) {
      const timeout = setTimeout(() => {
        setActiveSourceKey(Object.keys(sources)[0])
        setIsLoading(true)
        setPrevSize(null)
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, props.open, sources])

  const handleChange = useCallback((event: SelectChangeEvent) => {
    if (sizeRef.current)
      setPrevSize([sizeRef.current.offsetWidth, sizeRef.current.offsetHeight])

    setIsLoading(true)
    setActiveSourceKey(event.target.value)
  }, [])

  const source = sources[activeSourceKey]

  return (
    <StyledDialog {...props}>
      <StyledStack>
        <StyledHeader>
          <StyledTitle>Result for {title}</StyledTitle>
          {description ? (
            <StyledDescription>{description}</StyledDescription>
          ) : null}
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
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </StyledSelectWrapper>
        )}

        {isLoading ? (
          <StyledLoading dimensions={prevSize} />
        ) : (
          <StyledDataWrapper ref={sizeRef}>
            <StyledDataIndexesWrapper>
              {source.split('\n').map((_, index) => (
                <StyledDataIndex key={index}>{index}</StyledDataIndex>
              ))}
            </StyledDataIndexesWrapper>
            <div>
              <StyledSyntaxHighlighter source={source} />
            </div>
          </StyledDataWrapper>
        )}
      </StyledStack>
    </StyledDialog>
  )
}
