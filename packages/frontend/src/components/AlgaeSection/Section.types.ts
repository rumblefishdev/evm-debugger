import type { ContainerProps } from '@mui/material';
import type { RefObject } from 'react';

export interface SectionProps extends ContainerProps {
  width?: 'full' | 'normal' | 'small';
  mobilePadding?: boolean;
  positionRelativeOn?: boolean;
  useFullHeight?: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  backgroundColor?: string;
  position?: 'static';
  heightRef?: RefObject<HTMLDivElement> | null;
}

const prefix = 'Section';

export const sectionClasses = {
  full: `${prefix}-full`,
  normal: `${prefix}-normal`,
  small: `${prefix}-small`,
  mobilePadding: `${prefix}-mobilePadding`,
};
