import { createContext, useState, useEffect, type ReactNode, type FC, useContext } from 'react';
import { ConfigProvider, type ThemeConfig } from 'antd';
import { LocalStorageKey } from '@Procareful/common/lib';
import { ProcarefulTheme } from '@Procareful/ui';

interface ThemeContextProps {
  theme: ThemeConfig;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: ProcarefulTheme,
  updateTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(ProcarefulTheme);

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prevTheme => {
      const updatedTheme: ThemeConfig = {
        ...prevTheme,
        ...newTheme,
        token: {
          ...prevTheme.token,
          ...(newTheme.token || {}),
        },
      };

      if (newTheme.token && newTheme.token.fontSize) {
        localStorage.setItem(LocalStorageKey.SeniorFontSize, newTheme.token.fontSize.toString());
      }

      return updatedTheme;
    });
  };

  useEffect(() => {
    const storedFontSize = localStorage.getItem(LocalStorageKey.SeniorFontSize);
    if (storedFontSize) {
      const fontSizeValue = Number(storedFontSize);
      setTheme(prevTheme => ({
        ...prevTheme,
        token: {
          ...prevTheme.token,
          fontSize: fontSizeValue,
        },
      }));
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }

  return context;
};

export { ThemeProvider, useThemeContext };
