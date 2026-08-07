'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      dark: '#1d4ed8',
      light: '#3b82f6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b',
    },
    background: {
      default: '#eef1f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily:
      'var(--font-dm-sans), "DM Sans", "Segoe UI", Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 650 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, boxShadow: 'none' },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
          border: '1px solid #e8edf5',
        },
      },
    },
  },
});

export const colors = {
  sidebar: '#151c2e',
  sidebarHover: '#1e2940',
  sidebarActive: '#243252',
  accent: '#f59e0b',
  navy: '#0f2744',
  softBlue: '#eff6ff',
  heatTrack: '#e2e8f0',
  heatFill: '#2563eb',
};
