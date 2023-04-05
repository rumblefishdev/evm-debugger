import { Stack } from '@mui/material'
import React from 'react'

import { ParamBlock } from '../ParamBlock'

import type { EventBlockProps } from './EventBlock.types'

export const EventBlock = ({ eventLogs, ...props }: EventBlockProps) => (
  <Stack sx={{ marginBottom: '12px' }} {...props}>
    {eventLogs.map((event, rootIndex) =>
      event.signature ? (
        <ParamBlock
          key={rootIndex}
          title={`${event.signature}`}
          items={event.parsedArgs}
        />
      ) : null,
    )}
  </Stack>
)
