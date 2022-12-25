import React from 'react'
import { Box, Button, TextField } from '@mui/material'

export const CustomChainTransactionScreen = () => {
  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1 } }}
      noValidate
      autoComplete="off"
    >
      <TextField fullWidth label="Custom chain api" variant="outlined" />
      <Button variant="contained" component="label">
        Process logs
      </Button>
    </Box>
  )
}
