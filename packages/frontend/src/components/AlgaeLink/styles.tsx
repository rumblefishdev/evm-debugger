import type { LinkProps } from '@mui/material';
import { Link, styled } from '@mui/material';

export const StyledSpan = styled('span')(() => ({
  textDecoration: 'none',
  display: 'block',
})) as React.FC<LinkProps>;

export const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
})) as React.FC<LinkProps>;
