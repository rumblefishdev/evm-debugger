import React, { useEffect, useRef } from 'react'

import {
  StyledHeading,
  StyledLogContiner,
  StyledLogPanel,
  StyledLogRecord,
  StyledMessage,
  StyledTimestamp,
} from './styles'
import type { LoggerProps } from './types'

const getDate = (timestamp: Date | string): string => {
  return timestamp instanceof Date ? timestamp.toLocaleDateString() : timestamp
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
            <StyledLogRecord key={index}>
              <StyledTimestamp>{getDate(timestamp)}:</StyledTimestamp>
              <StyledMessage isError={isError} variant="inputText">
                {message}
              </StyledMessage>
            </StyledLogRecord>
          )
        })}
      </StyledLogContiner>
    </StyledLogPanel>
  )
}
