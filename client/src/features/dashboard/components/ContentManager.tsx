import { useState } from 'react'
import {
  Card, Typography, Box, Avatar, IconButton,
  Tooltip, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Button,
} from '@mui/material'
import { Delete, Edit, Visibility } from '@mui/icons-material'
import { MOCK_PHOTOS } from '@/features/discovery/services/mockPhotos'

export default function ContentManager() {
  const [photos, setPhotos] = useState(MOCK_PHOTOS.slice(0, 6))
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const confirmDelete = () => {
    setPhotos((p) => p.filter((ph) => ph._id !== deleteId))
    setDeleteId(null)
  }

  return (
    <>
      <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Content Management
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {photos.map((photo) => (
            <Box
              key={photo._id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, p: 1,
                borderRadius: 2, '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Avatar src={photo.thumbnailUrl} variant="rounded" sx={{ width: 44, height: 44 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {photo.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.25 }}>
                  <Chip icon={<Visibility sx={{ fontSize: '11px !important' }} />}
                    label={photo.viewsCount} size="small" variant="outlined"
                    sx={{ fontSize: '0.65rem', height: 18 }} />
                  {photo.tags.slice(0, 2).map((t) => (
                    <Chip key={t} label={`#${t}`} size="small" variant="outlined"
                      sx={{ fontSize: '0.65rem', height: 18 }} />
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.25 }}>
                <Tooltip title="Edit">
                  <IconButton size="small" aria-label="Edit photo"><Edit sx={{ fontSize: 16 }} /></IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => setDeleteId(photo._id)} aria-label="Delete photo">
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Photo?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This action cannot be undone. The photo will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} color="inherit">Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
