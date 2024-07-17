import React, { useCallback } from 'react'
import type { ButtonProps as MuiButtonProps } from '@mui/material'
import { Stack, Typography } from '@mui/material'

import type { ButtonProps } from './Button.types'
import { ArrowLeft, ArrowRight, StyledButton } from './styles'

// TODO: refactor to use next Link instead of onClick
export const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  size = 'medium',
  iconDirection = 'right',
  typographyProps,
  link,
  fontColor,
  ...props
}) => {
  const shouldHaveText = variant !== 'flat'
  const shouldHaveArrow = variant === 'flat' || variant === 'link'
  const Arrow = iconDirection === 'right' ? ArrowRight : ArrowLeft
  const handleClick = useCallback((clickLink: string | undefined) => {
    if (!clickLink) return
    window.location.href = clickLink
  }, [])

  const btnVariant: MuiButtonProps['variant'] = variant === 'flat' || variant === 'link' || variant === 'icon' ? 'text' : variant

  return (
    <StyledButton
      disableRipple
      size={size}
      variant={btnVariant}
      {...props}
    >
      <Stack onClick={() => handleClick(link)}>
        {variant === 'icon' ? (
          <>{children}</>
        ) : (
          <>
            {shouldHaveText && (
              <Typography
                sx={{ justifyContent: 'center', display: 'flex', color: fontColor ? `${fontColor} !important` : undefined }}
                {...typographyProps}
              >
                {children}
              </Typography>
            )}
            {shouldHaveArrow && <Arrow />}
          </>
        )}
      </Stack>
    </StyledButton>
  )
}
