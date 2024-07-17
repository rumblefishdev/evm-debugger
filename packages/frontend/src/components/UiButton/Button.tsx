import React, { useCallback, useContext } from 'react';
import type { ButtonProps } from './Button.types';
import { ArrowLeft, ArrowRight, StyledButton } from './styles';
import { Stack, Typography, ButtonProps as MuiButtonProps } from '@mui/material';

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
  const shouldHaveText = variant !== 'flat';
  const shouldHaveArrow = variant === 'flat' || variant === 'link';
  const Arrow = iconDirection === 'right' ? ArrowRight : ArrowLeft;
  const handleClick = useCallback(
    (link: string | undefined) => {
      if (!link) return;
      window.location.href = link;
    },
    [link]
  );

  const btnVariant: MuiButtonProps['variant'] = (variant === 'flat' || variant === 'link' || variant === 'icon') ? 'text' : variant;

  return (
    <StyledButton disableRipple size={size} variant={btnVariant} {...props}>
      <Stack onClick={() => handleClick(link)}>
        {variant === 'icon' ? (
          <>{children}</>
        ) : (
          <>
            {shouldHaveText && (
              <Typography
                sx={{ display: 'flex', justifyContent: 'center', color: fontColor ? `${fontColor} !important` : undefined }} {...typographyProps}>
                {children}
              </Typography>
            )}
            {shouldHaveArrow && <Arrow />}
          </>
        )}
      </Stack>
    </StyledButton>
  );
};
