import { useState, useMemo } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Stack,
} from '@mui/material'
import { Search, Whatshot, AccessTime, Favorite } from '@mui/icons-material'
import MasonryGrid from '@/features/discovery/components/MasonryGrid'
import PhotoLightbox from '@/features/discovery/components/PhotoLightbox'
import { useMasonryPhotos } from '@/features/discovery/hooks/useMasonryPhotos'
import type { Photo } from '@/types/photo'

type SortMode = 'trending' | 'latest' | 'most_liked'

const POPULAR_TAGS = ['landscape', 'portrait', 'street', 'macro', 'night', 'ocean', 'mountain']

export default function DiscoverPage() {
  const [search, setSearch] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('trending')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)

  const { photos, isLoading, isFetchingMore, hasMore, sentinelRef } = useMasonryPhotos()

  const filteredPhotos = useMemo(() => {
    let result = photos

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.exif?.camera?.toLowerCase().includes(q) ||
          p.exif?.location?.toLowerCase().includes(q) ||
          p.author.displayName.toLowerCase().includes(q)
      )
    }

    if (activeTag) {
      result = result.filter((p) => p.tags.includes(activeTag))
    }

    if (sortMode === 'most_liked') result = [...result].sort((a, b) => b.likesCount - a.likesCount)
    else if (sortMode === 'latest')
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

    return result
  }, [photos, search, activeTag, sortMode])

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Discover
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Explore stunning photography from the community
        </Typography>
      </Box>

      {/* Search + Sort bar */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
        }}
      >
        <TextField
          placeholder="Search by title, tag, camera, location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flex: 1, maxWidth: { sm: 480 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <ToggleButtonGroup
          value={sortMode}
          exclusive
          onChange={(_, val) => { if (val) setSortMode(val as SortMode) }}
          size="small"
          aria-label="Sort photos"
        >
          <ToggleButton value="trending" aria-label="Trending">
            <Whatshot sx={{ fontSize: 16, mr: 0.5 }} /> Trending
          </ToggleButton>
          <ToggleButton value="latest" aria-label="Latest">
            <AccessTime sx={{ fontSize: 16, mr: 0.5 }} /> Latest
          </ToggleButton>
          <ToggleButton value="most_liked" aria-label="Most liked">
            <Favorite sx={{ fontSize: 16, mr: 0.5 }} /> Popular
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Tag filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="All"
          onClick={() => setActiveTag(null)}
          variant={activeTag === null ? 'filled' : 'outlined'}
          color={activeTag === null ? 'secondary' : 'default'}
          size="small"
        />
        {POPULAR_TAGS.map((tag) => (
          <Chip
            key={tag}
            label={`#${tag}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            variant={activeTag === tag ? 'filled' : 'outlined'}
            color={activeTag === tag ? 'secondary' : 'default'}
            size="small"
          />
        ))}
      </Stack>

      {/* Results count */}
      {!isLoading && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
          {search || activeTag ? ' found' : ' loaded'}
        </Typography>
      )}

      {/* Masonry Grid */}
      <MasonryGrid
        photos={filteredPhotos}
        isLoading={isLoading}
        isFetchingMore={isFetchingMore}
        hasMore={hasMore}
        sentinelRef={sentinelRef}
        onPhotoClick={setLightboxPhoto}
      />

      {/* Lightbox */}
      <PhotoLightbox
        photo={lightboxPhoto}
        photos={filteredPhotos}
        onClose={() => setLightboxPhoto(null)}
        onNavigate={setLightboxPhoto}
      />
    </Container>
  )
}
