import React, { createContext, useCallback, useEffect, useState } from 'react';
import {
  ThemeContextType,
  ThemeType,
  TypesValues,
  scrollTargetType,
} from './theme.Context.types';
import Cookies from 'js-cookie';
export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeContextProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>({ type: 'light' });
  const [scrollTarget, setScrollTarget] = useState<scrollTargetType>(null);
  const changeScrollTarget = (el: scrollTargetType) => {
    setScrollTarget(el);
  };

  const cookieName = 'themeTypeCookie';
  const defaultTheme = 'light';

  const checkCookies = () => {
    const themeCookie = Cookies.get(cookieName) as TypesValues;
    if (!themeCookie) {
      const isBrowserDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      if (isBrowserDarkMode) {
        Cookies.set(cookieName, 'dark');
        setTheme({ type: 'dark' });
      } else Cookies.set(cookieName, defaultTheme);
    } else {
      if (themeCookie === theme.type) return;
      setTheme({ type: themeCookie });
    }
  };
  const triggerSetTheme = useCallback((type: TypesValues) => {
    setTheme({ type: type });
    Cookies.set(cookieName, type);
  }, []);

  const changeTheme = useCallback(() => {
    if (theme?.type === 'light') triggerSetTheme('dark');
    else triggerSetTheme('light');
  }, [theme.type]);

  useEffect(() => {
    checkCookies();
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, changeTheme, scrollTarget, changeScrollTarget }}>
      {children}
    </ThemeContext.Provider>
  );
};
