import React from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { DataAdder } from '../DataAdder'

import type { UploadJsonFileProps } from './UploadJsonFile.types'

function safeJsonParse(data: string): unknown {
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export const UploadJsonFile = ({ label, onChange, onBlur, title, buttonLabel = 'Add' }: UploadJsonFileProps) => {
  const [isOpen, setOpen] = React.useState<boolean>(false)
  return (
    <>
      <Typography variant="h4">{label}</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>
      <DataAdder
        title={title}
        submithandler={(data) => {
          onChange(safeJsonParse(data))
          setOpen(false)
          onBlur()
        }}
        open={isOpen}
        onClose={() => {
          setOpen(false)
          onBlur()
        }}
      />
    </>
  )
}
