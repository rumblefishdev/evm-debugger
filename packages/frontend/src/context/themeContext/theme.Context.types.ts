export type TypesValues = 'dark' | 'light';

export type ThemeType = {
  type: TypesValues;
};
export type scrollTargetType = HTMLElement | null;
export type ChangeThemeType = () => void;
export type changeScrollTargetType = (el: scrollTargetType) => void;
export type ThemeContextType = {
  theme: ThemeType;
  changeTheme: ChangeThemeType;
  scrollTarget: scrollTargetType;
  changeScrollTarget: changeScrollTargetType;
};
