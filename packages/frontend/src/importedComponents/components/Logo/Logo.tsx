import React from 'react'
import { useTheme } from '@mui/material'

import { isDarkOrNavy } from '../../../helpers/helpers'
import logoWhiteDarkMode from '../../assets/png/logo-white.png'
import AlgeaThemeLogo from '../../assets/png/logo.png'

import type { LogoProps } from './Logo.types'

export const Logo = ({ algeaTheme }: LogoProps) => {
  const useIsDarkOrNavyMode = (): boolean => {
    const theme = useTheme()
    return isDarkOrNavy(theme)
  }
  return (
    <a href="/">
      <img
        src={useIsDarkOrNavyMode ? logoWhiteDarkMode : AlgeaThemeLogo}
        width={algeaTheme ? '156px' : '208px'}
        height={algeaTheme ? '48px' : '64px'}
        alt="rumble fish logo"
        draggable="false"
        style={{ userSelect: 'none', cursor: 'pointer' }}
      />
    </a>
  )
}
