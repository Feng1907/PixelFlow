import { useState, useCallback } from 'react'
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Skeleton,
  Avatar,
  Tooltip,
} from '@mui/material'
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutlined,
  CameraAlt,
  Visibility,
} from '@mui/icons-material'
import { useInView } from 'react-intersection-observer'
import type { Photo } from '@/types/photo'

interface PhotoCardProps {
  photo: Photo
  onClick: (photo: Photo) => void
}

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  const [liked, setLiked] = useState(photo.isLiked)
  const [likesCount, setLikesCount] = useState(photo.likesCount)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' })

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setLiked((prev) => !prev)
      setLikesCount((prev) => prev + (liked ? -1 : 1))
    },
    [liked]
  )

  return (
    <Card
      ref={ref}
      onClick={() => onClick(photo)}
      sx={{
        mb: 2,
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
          '& .photo-overlay': { opacity: 1 },
        },
      }}
      elevation={0}
    >
      {/* Image container */}
      <Box sx={{ position: 'relative', bgcolor: 'action.hover' }}>
        {!imageLoaded && !imageError && (
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{ aspectRatio: '4/3', display: 'block' }}
            animation="wave"
          />
        )}

        {inView && !imageError && (
          <CardMedia
            component="img"
            image={photo.thumbnailUrl}
            alt={photo.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sx={{
              display: imageLoaded ? 'block' : 'none',
              width: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {imageError && (
          <Box
            sx={{
              aspectRatio: '4/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.selected',
            }}
          >
            <CameraAlt sx={{ fontSize: 48, color: 'text.disabled' }} />
          </Box>
        )}

        {/* Hover overlay */}
        {imageLoaded && (
          <Box
            className="photo-overlay"
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              p: 1.5,
            }}
          >
            {/* EXIF quick info */}
            {photo.exif?.camera && (
              <Chip
                icon={<CameraAlt sx={{ fontSize: '14px !important' }} />}
                label={photo.exif.camera}
                size="small"
                sx={{
                  alignSelf: 'flex-start',
                  mb: 1,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  fontSize: '0.7rem',
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            )}
            <Box sx={{ display: 'flex', gap: 1, color: 'white', fontSize: '0.8rem' }}>
              {photo.exif?.aperture && <span>{photo.exif.aperture}</span>}
              {photo.exif?.shutterSpeed && <span>{photo.exif.shutterSpeed}</span>}
              {photo.exif?.iso && <span>ISO {photo.exif.iso}</span>}
            </Box>
          </Box>
        )}
      </Box>

      {/* Card footer */}
      <CardContent sx={{ p: '10px 12px !important' }}>
        {/* Author row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
          <Avatar
            src={photo.author.avatar}
            alt={photo.author.displayName}
            sx={{ width: 24, height: 24, fontSize: '0.7rem' }}
          >
            {photo.author.displayName[0]}
          </Avatar>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {photo.author.displayName}
          </Typography>
          {photo.exif?.location && (
            <Typography
              variant="caption"
              sx={{ color: 'text.disabled', ml: 'auto', fontSize: '0.65rem' }}
            >
              📍 {photo.exif.location}
            </Typography>
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 0.5,
          }}
        >
          {photo.title}
        </Typography>

        {/* Stats row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={liked ? 'Unlike' : 'Like'}>
            <IconButton size="small" onClick={handleLike} sx={{ p: 0.5 }} aria-label="like photo">
              {liked ? (
                <Favorite sx={{ fontSize: 16, color: 'secondary.main' }} />
              ) : (
                <FavoriteBorder sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>
          <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
            {likesCount}
          </Typography>

          <ChatBubbleOutlined sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
            {photo.commentsCount}
          </Typography>

          <Visibility sx={{ fontSize: 14, color: 'text.disabled', ml: 'auto' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {photo.viewsCount.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
