import React, { createContext, useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import type { ThemeContextType, ThemeType, TypesValues, ScrollTargetType } from './theme.Context.types'

export const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeContextProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>({ type: 'light' })
  const [scrollTarget, setScrollTarget] = useState<ScrollTargetType>(null)
  const changeScrollTarget = (element: ScrollTargetType) => {
    setScrollTarget(element)
  }

  const cookieName = 'themeTypeCookie'
  const defaultTheme = 'light'

  const checkCookies = useCallback(() => {
    const themeCookie = Cookies.get(cookieName) as TypesValues
    if (!themeCookie) {
      const isBrowserDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isBrowserDarkMode) {
        Cookies.set(cookieName, 'dark')
        setTheme({ type: 'dark' })
      } else Cookies.set(cookieName, defaultTheme)
    } else {
      if (themeCookie === theme.type) return
      setTheme({ type: themeCookie })
    }
  }, [setTheme, theme.type])
  const triggerSetTheme = useCallback((type: TypesValues) => {
    setTheme({ type })
    Cookies.set(cookieName, type)
  }, [])

  const changeTheme = useCallback(() => {
    if (theme?.type === 'light') triggerSetTheme('dark')
    else triggerSetTheme('light')
  }, [theme.type, triggerSetTheme])

  useEffect(() => {
    checkCookies()
  }, [checkCookies])

  return <ThemeContext.Provider value={{ theme, scrollTarget, changeTheme, changeScrollTarget }}>{children}</ThemeContext.Provider>
}
