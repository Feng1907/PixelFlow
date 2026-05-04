import { useMemo, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { store } from '@/store'
import { useAppSelector } from '@/store'
import { createAppTheme } from '@/theme'
import { queryClient } from '@/services/queryClient'
import RootLayout from '@/components/layout/RootLayout'
import ProtectedRoute from '@/components/ui/ProtectedRoute'

// Lazy-loaded routes — each page becomes its own JS chunk
const HomePage     = lazy(() => import('@/pages/HomePage'))
const DiscoverPage = lazy(() => import('@/pages/DiscoverPage'))
const LoginPage    = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const ProfilePage  = lazy(() => import('@/pages/ProfilePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress color="secondary" />
    </Box>
  )
}

function ThemedApp() {
  const { mode } = useAppSelector((state) => state.theme)
  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="@:username" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemedApp />
      </QueryClientProvider>
    </Provider>
  )
}
