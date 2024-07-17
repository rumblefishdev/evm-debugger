export type TypesValues = 'dark' | 'light'

export type ThemeType = {
  type: TypesValues
}
export type ScrollTargetType = HTMLElement | null
export type ChangeThemeType = () => void
export type ChangeScrollTargetType = (element: ScrollTargetType) => void
export type ThemeContextType = {
  theme: ThemeType
  changeTheme: ChangeThemeType
  scrollTarget: ScrollTargetType
  changeScrollTarget: ChangeScrollTargetType
}
