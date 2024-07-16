import React, { useContext } from 'react';
import type { LinkProps } from './Link.types';
import { StyledSpan } from './styles';

export const Link = ({ children, to, ...props }: LinkProps) => {
  const fixScroll = () => {
    document.body.style.overflow = 'auto';
  }

  return (
    <a
      href={to}
      onClick={fixScroll}
      style={{ textDecoration: 'none' }}>
      <StyledSpan {...props}>{children}</StyledSpan>
    </a>
  );
};
