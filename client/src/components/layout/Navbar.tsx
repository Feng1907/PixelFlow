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
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material'
import { Brightness4, Brightness7, CameraAlt, AddAPhoto, Logout, Person, Dashboard } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { toggleTheme } from '@/store/slices/themeSlice'
import { clearUser } from '@/store/slices/authSlice'
import UploadDialog from '@/features/gallery/components/UploadDialog'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

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
                  <IconButton color="inherit" onClick={() => setUploadOpen(true)} aria-label="Upload photos">
                    <AddAPhoto />
                  </IconButton>
                </Tooltip>

                {/* Avatar menu */}
                <Tooltip title="My account">
                  <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ p: 0.5 }} aria-label="Account menu">
                    <Avatar
                      src={user?.avatar}
                      alt={user?.displayName}
                      sx={{ width: 34, height: 34, fontSize: '0.9rem', border: 2, borderColor: 'secondary.main' }}
                    >
                      {user?.displayName?.[0]}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={menuAnchor}
                  open={!!menuAnchor}
                  onClose={() => setMenuAnchor(null)}
                  slotProps={{ paper: { sx: { mt: 1, borderRadius: 2, minWidth: 180 } } }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.displayName}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>@{user?.username}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { setMenuAnchor(null); navigate(`/@${user?.username ?? ''}`) }}>
                    <Person sx={{ mr: 1.5, fontSize: 18 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => { setMenuAnchor(null); navigate('/dashboard') }}>
                    <Dashboard sx={{ mr: 1.5, fontSize: 18 }} /> Dashboard
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => { setMenuAnchor(null); dispatch(clearUser()); navigate('/login') }}
                    sx={{ color: 'error.main' }}
                  >
                    <Logout sx={{ mr: 1.5, fontSize: 18 }} /> Sign Out
                  </MenuItem>
                </Menu>
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
