import React from 'react'
import { useNavigate } from 'react-router-dom'

import { typedNavigate } from '../../router'

import type { NavigationProps } from './Navigation.types'
import { StyledButton, StyledStack } from './styles'

export const Navigation = ({ ...props }: NavigationProps) => {
  const navigate = useNavigate()

  return (
    <StyledStack {...props}>
      <StyledButton variant="outlined" onClick={() => typedNavigate(navigate, '/dataManager')}>
        Data Summary
      </StyledButton>
      <StyledButton variant="outlined" onClick={() => typedNavigate(navigate, '/transactionScreen')}>
        Transaction Screen
      </StyledButton>
      <StyledButton variant="outlined" onClick={() => typedNavigate(navigate, '/structlogsExplorer')}>
        Struct Logs Explorer
      </StyledButton>
    </StyledStack>
  )
}
