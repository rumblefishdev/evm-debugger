import { Stack } from '@mui/material';
import React from 'react';

import { Link } from '../Link';

import type { MenuBoxCoverProps } from './MenuBoxCover.types';
import { StyledText, StyledMenuItem } from './styles';

export const MenuBoxCover = ({
  text,
  cover,
  to,
  ...props
}: MenuBoxCoverProps) => (
  <Stack
    direction="column"
    justifyContent="space-around"
    alignItems="center"
    {...props}>
    <Link to={to}>
      <img src={cover} alt="ebook box" />
    </Link>
    <StyledText variant="caption">{text}</StyledText>
    <StyledMenuItem to={to}>Download</StyledMenuItem>
  </Stack>
);
