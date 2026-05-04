import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Card,
  CardMedia,
  TextField,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
  Collapse,
  Tooltip,
} from '@mui/material'
import {
  Close,
  CheckCircle,
  ErrorOutlined,
  ExpandMore,
  ExpandLess,
  CameraAlt,
} from '@mui/icons-material'
import { useState } from 'react'
import { photoMetaSchema, type PhotoMetaValues, type UploadFile } from '../types'

interface UploadPreviewCardProps {
  item: UploadFile
  onRemove: (id: string) => void
  onMetaChange: (id: string, meta: PhotoMetaValues) => void
}

const STATUS_COLOR = {
  idle: 'default',
  compressing: 'warning',
  uploading: 'info',
  success: 'success',
  error: 'error',
} as const

const STATUS_LABEL = {
  idle: 'Ready',
  compressing: 'Compressing…',
  uploading: 'Uploading…',
  success: 'Uploaded',
  error: 'Failed',
}

export default function UploadPreviewCard({ item, onRemove, onMetaChange }: UploadPreviewCardProps) {
  const [expanded, setExpanded] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhotoMetaValues>({
    resolver: zodResolver(photoMetaSchema),
    defaultValues: { title: item.file.name.replace(/\.[^.]+$/, '') },
  })

  const fileSizeMB = (item.file.size / 1024 / 1024).toFixed(1)

  return (
    <Card
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
    >
      <Box sx={{ display: 'flex', gap: 0 }}>
        {/* Thumbnail */}
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <CardMedia
            component="img"
            image={item.previewUrl}
            alt={item.file.name}
            sx={{ width: 120, height: 120, objectFit: 'cover' }}
          />
          {/* Status overlay */}
          {item.status === 'success' && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle sx={{ color: 'success.light', fontSize: 36 }} />
            </Box>
          )}
          {item.status === 'error' && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ErrorOutlined sx={{ color: 'error.light', fontSize: 36 }} />
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {item.file.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {fileSizeMB} MB
                {item.compressedFile &&
                  ` → ${(item.compressedFile.size / 1024 / 1024).toFixed(1)} MB compressed`}
              </Typography>
            </Box>

            <Chip
              label={STATUS_LABEL[item.status]}
              color={STATUS_COLOR[item.status]}
              size="small"
              sx={{ fontSize: '0.65rem', height: 20 }}
            />

            <Tooltip title="Remove">
              <IconButton
                size="small"
                onClick={() => onRemove(item.id)}
                disabled={item.status === 'uploading'}
                aria-label="Remove photo"
                sx={{ p: 0.25 }}
              >
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Progress bar */}
          {(item.status === 'compressing' || item.status === 'uploading') && (
            <LinearProgress
              variant={item.status === 'compressing' ? 'indeterminate' : 'determinate'}
              value={item.progress}
              color={item.status === 'compressing' ? 'warning' : 'secondary'}
              sx={{ borderRadius: 1, height: 4 }}
            />
          )}

          {/* Error message */}
          {item.status === 'error' && item.errorMessage && (
            <Typography variant="caption" sx={{ color: 'error.main' }}>
              {item.errorMessage}
            </Typography>
          )}

          {/* EXIF quick badge */}
          {item.exif?.camera && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CameraAlt sx={{ fontSize: 13, color: 'secondary.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                {item.exif.camera}
                {item.exif.aperture ? ` · ${item.exif.aperture}` : ''}
                {item.exif.iso ? ` · ISO ${item.exif.iso}` : ''}
              </Typography>
            </Box>
          )}

          {/* Toggle metadata form */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', mt: 'auto' }}
            onClick={() => setExpanded((p) => !p)}
            role="button"
            aria-expanded={expanded}
          >
            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600 }}>
              {expanded ? 'Hide details' : 'Add title & tags'}
            </Typography>
            {expanded ? (
              <ExpandLess sx={{ fontSize: 14, color: 'secondary.main' }} />
            ) : (
              <ExpandMore sx={{ fontSize: 14, color: 'secondary.main' }} />
            )}
          </Box>
        </Box>
      </Box>

      {/* Metadata form */}
      <Collapse in={expanded}>
        <Box
          component="form"
          onBlur={handleSubmit((vals) => onMetaChange(item.id, vals))}
          sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}
          noValidate
        >
          <TextField
            label="Title"
            size="small"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
            {...register('title')}
          />
          <TextField
            label="Description"
            size="small"
            fullWidth
            multiline
            rows={2}
            {...register('description')}
          />
          <TextField
            label="Tags (comma separated)"
            size="small"
            fullWidth
            placeholder="landscape, mountain, sony"
            {...register('tags')}
          />
        </Box>
      </Collapse>
    </Card>
  )
}
