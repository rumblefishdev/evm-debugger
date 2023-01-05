import type { LinkProps } from '@mui/material';
import { Link, styled } from '@mui/material';

export const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
})) as React.FC<LinkProps>;
