import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
} from '@mui/material'
import { PhotoLibrary, FavoriteBorder } from '@mui/icons-material'
import ProfileHeader from '@/features/auth/components/ProfileHeader'
import MasonryGrid from '@/features/discovery/components/MasonryGrid'
import PhotoLightbox from '@/features/discovery/components/PhotoLightbox'
import { usePublicProfile } from '@/features/auth/hooks/useProfile'
import { useMasonryPhotos } from '@/features/discovery/hooks/useMasonryPhotos'
import type { Photo } from '@/types/photo'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [tab, setTab] = useState(0)
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)

  const { data: user, isLoading: profileLoading, error } = usePublicProfile(username ?? '')
  const { photos, isLoading: photosLoading, isFetchingMore, hasMore, sentinelRef } =
    useMasonryPhotos()

  if (!username) return <Navigate to="/" replace />

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">User @{username} not found.</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      {/* Profile header — skeleton while loading */}
      <ProfileHeader
        user={user ?? {
          _id: '',
          username: username,
          email: '',
          displayName: username,
          followersCount: 0,
          followingCount: 0,
          photosCount: 0,
          createdAt: '',
        }}
        isLoading={profileLoading}
      />

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        sx={{ mb: 3 }}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab icon={<PhotoLibrary sx={{ fontSize: 18 }} />} iconPosition="start" label="Photos" />
        <Tab icon={<FavoriteBorder sx={{ fontSize: 18 }} />} iconPosition="start" label="Liked" />
      </Tabs>

      {tab === 0 && (
        <>
          {!photosLoading && photos.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography sx={{ color: 'text.secondary' }}>
                No photos yet.
              </Typography>
            </Box>
          )}
          <MasonryGrid
            photos={photos}
            isLoading={photosLoading}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            sentinelRef={sentinelRef}
            onPhotoClick={setLightboxPhoto}
          />
        </>
      )}

      {tab === 1 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography sx={{ color: 'text.secondary' }}>Liked photos coming soon.</Typography>
        </Box>
      )}

      <PhotoLightbox
        photo={lightboxPhoto}
        photos={photos}
        onClose={() => setLightboxPhoto(null)}
        onNavigate={setLightboxPhoto}
      />
    </Container>
  )
}
