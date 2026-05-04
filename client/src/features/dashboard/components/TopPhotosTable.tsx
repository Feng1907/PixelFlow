import {
  Card,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material'
import { Favorite, Visibility } from '@mui/icons-material'
import { MOCK_PHOTOS } from '@/features/discovery/services/mockPhotos'

const TOP = [...MOCK_PHOTOS]
  .sort((a, b) => b.likesCount - a.likesCount)
  .slice(0, 5)

export default function TopPhotosTable() {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        Top Performing Photos
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {TOP.map((photo, i) => (
          <Box
            key={photo._id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1,
              borderRadius: 2,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.disabled', width: 16, flexShrink: 0 }}>
              {i + 1}
            </Typography>
            <Avatar
              src={photo.thumbnailUrl}
              variant="rounded"
              sx={{ width: 44, height: 44, flexShrink: 0 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {photo.title}
              </Typography>
              {photo.exif?.camera && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {photo.exif.camera}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Chip
                icon={<Favorite sx={{ fontSize: '12px !important' }} />}
                label={photo.likesCount}
                size="small"
                sx={{ fontSize: '0.7rem', height: 22, bgcolor: 'secondary.main', color: 'white',
                  '& .MuiChip-icon': { color: 'white' } }}
              />
              <Chip
                icon={<Visibility sx={{ fontSize: '12px !important' }} />}
                label={photo.viewsCount.toLocaleString()}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 22 }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
