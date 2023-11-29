import React from 'react'
import DragHandleIcon from '@mui/icons-material/DragHandle'

export const GridLayoutHandler: React.FC = () => {
  return (
    <div
      className="grid-draggable-handle"
      style={{
        justifyContent: 'center',
        display: 'flex',
        cursor: 'grab',
        alignItems: 'center',
      }}
    >
      <DragHandleIcon />
    </div>
  )
}
