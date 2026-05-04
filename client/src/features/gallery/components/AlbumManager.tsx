import { useState } from 'react'
import {
  Box, Card, CardMedia, CardActionArea, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Chip, IconButton, Tooltip,
} from '@mui/material'
import { Add, PhotoLibrary, Delete } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MOCK_PHOTOS } from '@/features/discovery/services/mockPhotos'

const schema = z.object({ title: z.string().min(1, 'Required').max(100) })
type FormValues = z.infer<typeof schema>

interface Album { id: string; title: string; coverUrl?: string; count: number }

const INITIAL_ALBUMS: Album[] = [
  { id: 'a1', title: 'Landscape', coverUrl: MOCK_PHOTOS[0].thumbnailUrl, count: 5 },
  { id: 'a2', title: 'Street Life', coverUrl: MOCK_PHOTOS[6].thumbnailUrl, count: 8 },
  { id: 'a3', title: 'Portrait', coverUrl: MOCK_PHOTOS[5].thumbnailUrl, count: 3 },
]

export default function AlbumManager() {
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS)
  const [createOpen, setCreateOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (v: FormValues) => {
    setAlbums((prev) => [...prev, { id: `a${Date.now()}`, title: v.title, count: 0 }])
    reset()
    setCreateOpen(false)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Albums</Typography>
        <Button size="small" startIcon={<Add />} variant="outlined" color="secondary"
          onClick={() => setCreateOpen(true)}>
          New Album
        </Button>
      </Box>

      <Grid container spacing={2}>
        {albums.map((album) => (
          <Grid key={album.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
              <CardActionArea>
                {album.coverUrl ? (
                  <CardMedia component="img" image={album.coverUrl} sx={{ height: 120, objectFit: 'cover' }} />
                ) : (
                  <Box sx={{ height: 120, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhotoLibrary sx={{ fontSize: 40, color: 'text.disabled' }} />
                  </Box>
                )}
              </CardActionArea>
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {album.title}
                  </Typography>
                  <Chip label={`${album.count} photos`} size="small" sx={{ fontSize: '0.65rem', height: 18, mt: 0.25 }} />
                </Box>
                <Tooltip title="Delete album">
                  <IconButton size="small" onClick={() => setAlbums((p) => p.filter((a) => a.id !== album.id))}
                    aria-label="Delete album">
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>New Album</DialogTitle>
        <DialogContent>
          <Box component="form" id="album-form" onSubmit={handleSubmit(onSubmit)} sx={{ pt: 1 }} noValidate>
            <TextField label="Album title" fullWidth autoFocus
              error={!!errors.title} helperText={errors.title?.message} {...register('title')} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateOpen(false)} color="inherit">Cancel</Button>
          <Button type="submit" form="album-form" variant="contained" color="secondary">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
