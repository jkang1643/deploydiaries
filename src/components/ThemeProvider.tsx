'use client'

import React from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import theme from '../theme/theme';

// Create emotion cache
const cache = createCache({
  key: 'css',
  prepend: true,
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <CacheProvider value={cache}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </CacheProvider>
  );
}
