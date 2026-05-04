import { createTheme, type PaletteMode } from '@mui/material'

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: '#1a1a2e',
      light: '#16213e',
      dark: '#0f0f1a',
    },
    secondary: {
      main: '#e94560',
      light: '#ff6b8a',
      dark: '#b5103a',
    },
    background: {
      default: mode === 'dark' ? '#0d0d0d' : '#f5f5f5',
      paper: mode === 'dark' ? '#1a1a2e' : '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 600,
        },
      },
    },
  },
})

export const createAppTheme = (mode: PaletteMode) =>
  createTheme(getDesignTokens(mode))
