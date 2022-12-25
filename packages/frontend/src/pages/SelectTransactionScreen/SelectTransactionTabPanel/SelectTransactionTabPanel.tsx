import React from 'react'
import { Box, Typography } from '@mui/material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export const SelectTransactionTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props
  if (value !== index) return null

  return (
    <div role="tabpanel" aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}
