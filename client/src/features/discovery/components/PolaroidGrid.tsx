import { Box, Typography } from '@mui/material'
import type { Photo } from '@/types/photo'

interface PolaroidGridProps {
  photos: Photo[]
  onPhotoClick: (photo: Photo) => void
}

export default function PolaroidGrid({ photos, onPhotoClick }: PolaroidGridProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'center',
        py: 2,
      }}
    >
      {photos.map((photo, i) => (
        <Box
          key={photo._id}
          onClick={() => onPhotoClick(photo)}
          sx={{
            cursor: 'pointer',
            bgcolor: '#fefefe',
            p: '12px 12px 40px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            borderRadius: '2px',
            transform: `rotate(${(i % 2 === 0 ? 1 : -1) * parseFloat((Math.random() * 2 + 0.5).toFixed(1))}deg)`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            width: 160,
            '&:hover': {
              transform: 'rotate(0deg) scale(1.05)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
              zIndex: 10,
            },
          }}
        >
          <Box
            component="img"
            src={photo.thumbnailUrl}
            alt={photo.title}
            sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
          />
          <Typography
            sx={{
              mt: 1,
              fontSize: '0.72rem',
              color: '#444',
              fontFamily: '"Caveat", cursive, sans-serif',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {photo.title}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
