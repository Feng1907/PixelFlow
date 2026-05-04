import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Typography, alpha, useTheme } from '@mui/material'
import { CloudUpload, AddPhotoAlternate } from '@mui/icons-material'
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_FILES } from '../types'

interface DropZoneProps {
  onFilesAccepted: (files: File[]) => void
  currentCount: number
  disabled?: boolean
}

export default function DropZone({ onFilesAccepted, currentCount, disabled }: DropZoneProps) {
  const theme = useTheme()
  const remaining = MAX_FILES - currentCount

  const onDrop = useCallback(
    (accepted: File[]) => {
      onFilesAccepted(accepted.slice(0, remaining))
    },
    [onFilesAccepted, remaining]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    maxFiles: remaining,
    disabled: disabled || remaining <= 0,
  })

  const borderColor = isDragReject
    ? theme.palette.error.main
    : isDragActive
      ? theme.palette.secondary.main
      : theme.palette.divider

  const bgColor = isDragReject
    ? alpha(theme.palette.error.main, 0.05)
    : isDragActive
      ? alpha(theme.palette.secondary.main, 0.08)
      : 'transparent'

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: 2,
        borderStyle: 'dashed',
        borderColor,
        borderRadius: 3,
        bgcolor: bgColor,
        p: 5,
        textAlign: 'center',
        cursor: disabled || remaining <= 0 ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        outline: 'none',
        '&:focus-visible': {
          boxShadow: `0 0 0 3px ${alpha(theme.palette.secondary.main, 0.4)}`,
        },
      }}
      role="button"
      aria-label="Upload photos drop zone"
    >
      <input {...getInputProps()} />

      {isDragActive && !isDragReject ? (
        <>
          <CloudUpload sx={{ fontSize: 56, color: 'secondary.main', mb: 1.5 }} />
          <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 600 }}>
            Drop your photos here!
          </Typography>
        </>
      ) : isDragReject ? (
        <>
          <CloudUpload sx={{ fontSize: 56, color: 'error.main', mb: 1.5 }} />
          <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
            File type not supported
          </Typography>
        </>
      ) : remaining <= 0 ? (
        <>
          <AddPhotoAlternate sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Maximum {MAX_FILES} photos reached
          </Typography>
        </>
      ) : (
        <>
          <CloudUpload sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
            Drag & drop photos here
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} gutterBottom>
            or click to browse files
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 1 }}>
            JPG, PNG, WebP, HEIC, TIFF · Max {MAX_FILE_SIZE_MB}MB per file · Up to {remaining}{' '}
            more photo{remaining !== 1 ? 's' : ''}
          </Typography>
        </>
      )}
    </Box>
  )
}
