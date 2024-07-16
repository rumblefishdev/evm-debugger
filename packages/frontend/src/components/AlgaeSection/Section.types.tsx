export type SectionType = 'normal' | 'narrow';
export type SectionTheme = 'white' | 'gray' | 'blue' | 'darkBlue' | 'none';
export type TSpacingType = 'small' | 'large';

export type SectionProps = {
  width?: string;
  backgroundColor?: string;
  type?: SectionType;
  theme?: SectionTheme;
  relative?: boolean;
  topOverlay?: boolean;
  spacingType?: TSpacingType;
  children?: React.ReactNode;
  positionRelativeOn?: boolean;
  mobilePadding?: boolean;
  useFullHeight?: boolean;
  noPadding?: 'top' | 'bottom' | 'left' | 'right' | 'vertical' | 'horizontal' | 'all';
  sx?: unknown;
};
