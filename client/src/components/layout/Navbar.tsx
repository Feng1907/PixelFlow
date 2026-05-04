import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  useTheme,
  Tooltip,
} from '@mui/material'
import { Brightness4, Brightness7, CameraAlt, AddAPhoto } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { toggleTheme } from '@/store/slices/themeSlice'
import UploadDialog from '@/features/gallery/components/UploadDialog'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 1 }}>
          <CameraAlt sx={{ color: 'secondary.main', mr: 1 }} />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
            onClick={() => navigate('/')}
          >
            PixelFlow
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button color="inherit" onClick={() => navigate('/discover')}>
              Discover
            </Button>
            {isAuthenticated ? (
              <>
                <Tooltip title="Upload photos">
                  <IconButton
                    color="inherit"
                    onClick={() => setUploadOpen(true)}
                    aria-label="Upload photos"
                  >
                    <AddAPhoto />
                  </IconButton>
                </Tooltip>
                <Button variant="outlined" color="secondary" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Tooltip title="Upload photos — sign in required">
                  <span>
                    <IconButton
                      color="inherit"
                      onClick={() => navigate('/login')}
                      aria-label="Upload photos"
                    >
                      <AddAPhoto />
                    </IconButton>
                  </span>
                </Tooltip>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            )}
            <IconButton onClick={() => dispatch(toggleTheme())} color="inherit" aria-label="Toggle theme">
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  )
}
