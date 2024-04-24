import React, { createContext, useState, useContext } from 'react';

const themes = {
  light: {
    headerFooter: '#FFFFFF',
    basicText: '#000000',
    selectedTab: '#861F41',
    pill: '#861F41',
    bottomSheet: '#FFFFFF',
    favoritesSymbol: '#861F41',
  },
  dark: {
    headerFooter: '#861F41',
    basicText: '#FFFFFF',
    selectedTab: '#E5751F',
    pill: '#E5751F',
    bottomSheet: '#861F41',
    favoritesSymbol: '#E5751F',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
