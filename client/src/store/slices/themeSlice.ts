import { createSlice } from '@reduxjs/toolkit'
import type { PaletteMode } from '@mui/material'

interface ThemeState {
  mode: PaletteMode
}

const initialState: ThemeState = {
  mode: (localStorage.getItem('themeMode') as PaletteMode) ?? 'dark',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
      localStorage.setItem('themeMode', state.mode)
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
