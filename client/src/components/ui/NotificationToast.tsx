import { useEffect, useState } from 'react'
import { Snackbar, Box, Avatar, Typography } from '@mui/material'
import { Favorite, ChatBubbleOutlined, PersonAdd } from '@mui/icons-material'
import { useSocket, type NotificationEvent } from '@/hooks/useSocket'

const ICON_MAP = {
  like: <Favorite sx={{ fontSize: 16, color: '#e94560' }} />,
  comment: <ChatBubbleOutlined sx={{ fontSize: 16, color: '#2196f3' }} />,
  follow: <PersonAdd sx={{ fontSize: 16, color: '#4caf50' }} />,
}

export default function NotificationToast() {
  const [notification, setNotification] = useState<NotificationEvent | null>(null)
  const { onNotification } = useSocket()

  useEffect(() => {
    return onNotification((event) => {
      setNotification(event)
    })
  }, [onNotification])

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={4000}
      onClose={() => setNotification(null)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          px: 2,
          py: 1.5,
          boxShadow: 4,
          minWidth: 280,
        }}
      >
        <Avatar
          src={notification?.fromUser.avatar}
          sx={{ width: 36, height: 36, fontSize: '0.85rem' }}
        >
          {notification?.fromUser.username[0].toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            @{notification?.fromUser.username}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {notification && ICON_MAP[notification.type]}
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {notification?.message}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Snackbar>
  )
}
