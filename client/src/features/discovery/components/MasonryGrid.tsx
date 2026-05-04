import Masonry from 'react-masonry-css'
import { Box, Skeleton, CircularProgress, Typography } from '@mui/material'
import PhotoCard from './PhotoCard'
import type { Photo } from '@/types/photo'
import './masonry.css'

const BREAKPOINTS = {
  default: 4,
  1280: 3,
  900: 2,
  600: 1,
}

interface MasonryGridProps {
  photos: Photo[]
  isLoading: boolean
  isFetchingMore: boolean
  hasMore: boolean
  sentinelRef: (node?: Element | null) => void
  onPhotoClick: (photo: Photo) => void
}

function PhotoSkeleton() {
  return (
    <Box sx={{ mb: 2 }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        sx={{
          borderRadius: 2,
          aspectRatio: Math.random() > 0.5 ? '3/4' : '4/3',
        }}
        animation="wave"
      />
      <Box sx={{ mt: 1, px: 0.5 }}>
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={14} />
      </Box>
    </Box>
  )
}

export default function MasonryGrid({
  photos,
  isLoading,
  isFetchingMore,
  hasMore,
  sentinelRef,
  onPhotoClick,
}: MasonryGridProps) {
  if (isLoading) {
    return (
      <Masonry breakpointCols={BREAKPOINTS} className="masonry-grid" columnClassName="masonry-col">
        {Array.from({ length: 8 }).map((_, i) => (
          <PhotoSkeleton key={i} />
        ))}
      </Masonry>
    )
  }

  if (photos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          No photos yet. Be the first to share!
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Masonry breakpointCols={BREAKPOINTS} className="masonry-grid" columnClassName="masonry-col">
        {photos.map((photo) => (
          <PhotoCard key={photo._id} photo={photo} onClick={onPhotoClick} />
        ))}
      </Masonry>

      {/* Infinite scroll sentinel */}
      <Box ref={sentinelRef} sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
        {isFetchingMore && <CircularProgress size={28} color="secondary" />}
        {!hasMore && photos.length > 0 && (
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            You&apos;ve seen all photos
          </Typography>
        )}
      </Box>
    </Box>
  )
}
