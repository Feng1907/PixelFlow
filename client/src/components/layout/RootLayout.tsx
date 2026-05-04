import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import NotificationToast from '@/components/ui/NotificationToast'

export default function RootLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <NotificationToast />
    </Box>
  )
}
