import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material'
import {
  Close,
  FavoriteBorder,
  Favorite,
  ChatBubbleOutlined,
  CameraAlt,
  Visibility,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material'
import { useState, useEffect, useCallback } from 'react'
import type { Photo } from '@/types/photo'
import CommentSection from './CommentSection'

interface PhotoLightboxProps {
  photo: Photo | null
  photos: Photo[]
  onClose: () => void
  onNavigate: (photo: Photo) => void
}

export default function PhotoLightbox({
  photo,
  photos,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    if (photo) {
      setLiked(photo.isLiked)
      setLikesCount(photo.likesCount)
    }
  }, [photo])

  const currentIndex = photo ? photos.findIndex((p) => p._id === photo._id) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(photos[currentIndex + 1])
  }, [hasNext, currentIndex, photos, onNavigate])

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(photos[currentIndex - 1])
  }, [hasPrev, currentIndex, photos, onNavigate])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, onClose])

  if (!photo) return null

  return (
    <Dialog
      open={!!photo}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.default',
            backgroundImage: 'none',
            maxWidth: 1200,
            m: 2,
            borderRadius: 3,
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Image panel */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            bgcolor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: 300, md: 600 },
          }}
        >
          <Box
            component="img"
            src={photo.imageUrl}
            alt={photo.title}
            sx={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }}
          />

          {/* Close */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
            }}
            aria-label="Close lightbox"
          >
            <Close />
          </IconButton>

          {/* Prev */}
          {hasPrev && (
            <IconButton
              onClick={goPrev}
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              }}
              aria-label="Previous photo"
            >
              <ArrowBackIos />
            </IconButton>
          )}

          {/* Next */}
          {hasNext && (
            <IconButton
              onClick={goNext}
              sx={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              }}
              aria-label="Next photo"
            >
              <ArrowForwardIos />
            </IconButton>
          )}
        </Box>

        {/* Info panel */}
        <Box
          sx={{
            width: { xs: '100%', md: 320 },
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
          }}
        >
          {/* Author */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={photo.author.avatar} sx={{ width: 40, height: 40 }}>
              {photo.author.displayName[0]}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {photo.author.displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                @{photo.author.username}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {photo.title}
          </Typography>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title={liked ? 'Unlike' : 'Like'}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                onClick={() => {
                  setLiked((p) => !p)
                  setLikesCount((p) => p + (liked ? -1 : 1))
                }}
                role="button"
                aria-label="like"
              >
                {liked ? (
                  <Favorite sx={{ color: 'secondary.main', fontSize: 20 }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                )}
                <Typography variant="body2">{likesCount}</Typography>
              </Box>
            </Tooltip>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ChatBubbleOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2">{photo.commentsCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
              <Visibility sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2">{photo.viewsCount.toLocaleString()}</Typography>
            </Box>
          </Box>

          <Divider />

          {/* EXIF data */}
          {photo.exif && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CameraAlt sx={{ fontSize: 18, color: 'secondary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Camera Info
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {[
                  { label: 'Camera', value: photo.exif.camera },
                  { label: 'Lens', value: photo.exif.lens },
                  { label: 'Aperture', value: photo.exif.aperture },
                  { label: 'Shutter', value: photo.exif.shutterSpeed },
                  { label: 'ISO', value: photo.exif.iso?.toString() },
                  { label: 'Location', value: photo.exif.location },
                ]
                  .filter((row) => row.value)
                  .map(({ label, value }) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {label}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {value}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Box>
          )}

          <Divider />

          {/* Tags */}
          {photo.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {photo.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', borderColor: 'divider' }}
                />
              ))}
            </Box>
          )}

          <Divider />

          {/* Comments */}
          <Box sx={{ flex: 1, minHeight: 180 }}>
            <CommentSection photoId={photo._id} initialCount={photo.commentsCount} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
