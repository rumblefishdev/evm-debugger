import React from 'react'

import AlgeaThemeLogo from '../../assets/png/logo.png'

import type { LogoProps } from './Logo.types'

export const Logo = ({ algeaTheme }: LogoProps) => {
  return (
    <a href="/">
      <img
        src={algeaTheme ? AlgeaThemeLogo : ''}
        width={algeaTheme ? '156px' : '208px'}
        height={algeaTheme ? '48px' : '64px'}
        alt="rumble fish logo"
        draggable="false"
        style={{ userSelect: 'none', cursor: 'pointer' }}
      />
    </a>
  )
}
