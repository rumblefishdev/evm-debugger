import React from 'react'
import type { SelectChangeEvent } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material'

import type { SelectMenuProps } from './SelectMenu.types'

export const SelectMenu: React.FC<SelectMenuProps> = ({ elements, selectedElement, selectionCallback, ...props }) => {
  const labelId = React.useId()

  const handleSelection = React.useCallback(
    (event: SelectChangeEvent) => {
      selectionCallback(event.target.value)
    },
    [selectionCallback],
  )

  return (
    <Stack {...props}>
      <FormControl fullWidth>
        <InputLabel id={labelId}>File</InputLabel>
        <Select
          label="File"
          labelId={labelId}
          value={selectedElement}
          onChange={handleSelection}
        >
          {elements.map((value) => (
            <MenuItem
              key={value}
              value={value}
            >
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}
