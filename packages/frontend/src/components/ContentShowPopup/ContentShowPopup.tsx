import React from 'react'

import type { ContentShowPopupProps } from './ContentShowPopup.types'
import { StyledDialog } from './styles'

export const ContentShowPopup = ({ popupData, ...props }: ContentShowPopupProps) => <StyledDialog {...props}>{popupData}</StyledDialog>
