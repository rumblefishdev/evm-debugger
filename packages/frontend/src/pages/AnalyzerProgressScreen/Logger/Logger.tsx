import React, { useEffect, useRef } from 'react'

import {
  StyledHeading,
  StyledLogContiner,
  StyledLogPanel,
  StyledMessage,
  StyledTimestamp,
} from './styles'
import type { LoggerProps } from './types'

const getTime = (timestamp: Date | string | number): string => {
  const ts = typeof timestamp === 'number' ? new Date(timestamp) : timestamp
  return ts instanceof Date ? ts.toLocaleTimeString() : ts
}

export const Logger = ({ messages, ...props }: LoggerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  return (
    <StyledLogPanel {...props}>
      <StyledHeading variant="headingUnknown">Console info</StyledHeading>
      <StyledLogContiner ref={scrollRef}>
        {messages.map((item, index) => {
          const { message, timestamp } = item
          const isError = message.includes('Error')

          return (
            <React.Fragment key={index}>
              <StyledTimestamp>{getTime(timestamp)}:</StyledTimestamp>
              <StyledMessage isError={isError} variant="inputText">
                {message}
              </StyledMessage>
            </React.Fragment>
          )
        })}
      </StyledLogContiner>
    </StyledLogPanel>
  )
}
