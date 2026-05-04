import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Divider,
  Alert,
} from '@mui/material'
import { Close, CloudUpload } from '@mui/icons-material'
import imageCompression from 'browser-image-compression'
import { nanoid } from '@/utils/nanoid'
import DropZone from './DropZone'
import UploadPreviewCard from './UploadPreviewCard'
import { useExifExtractor } from '../hooks/useExifExtractor'
import type { UploadFile, PhotoMetaValues } from '../types'
import { MAX_FILES } from '../types'

interface UploadDialogProps {
  open: boolean
  onClose: () => void
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 2,
  maxWidthOrHeight: 2400,
  useWebWorker: true,
  fileType: 'image/webp',
}

export default function UploadDialog({ open, onClose }: UploadDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [_metaMap, setMetaMap] = useState<Record<string, PhotoMetaValues>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { extract } = useExifExtractor()

  const totalProgress =
    files.length === 0
      ? 0
      : files.reduce((sum, f) => sum + f.progress, 0) / files.length

  const handleFilesAccepted = useCallback(
    async (accepted: File[]) => {
      const newItems: UploadFile[] = accepted.map((file) => ({
        id: nanoid(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'idle',
        progress: 0,
      }))

      setFiles((prev) => [...prev, ...newItems])

      // Extract EXIF + compress in parallel per file
      for (const item of newItems) {
        // EXIF extraction (non-blocking)
        extract(item.file).then((exif) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, exif } : f))
          )
        })

        // Compress
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'compressing' } : f))
        )
        try {
          const compressed = await imageCompression(item.file, COMPRESSION_OPTIONS)
          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id ? { ...f, compressedFile: compressed, status: 'idle' } : f
            )
          )
        } catch {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, status: 'idle' } : f))
          )
        }
      }
    },
    [extract]
  )

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id)
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((f) => f.id !== id)
    })
    setMetaMap((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const handleMetaChange = useCallback((id: string, meta: PhotoMetaValues) => {
    setMetaMap((prev) => ({ ...prev, [id]: meta }))
  }, [])

  const handleUpload = async () => {
    if (files.length === 0) return
    setIsUploading(true)
    setGlobalError(null)

    for (const item of files) {
      if (item.status === 'success') continue

      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'uploading', progress: 0 } : f))
      )

      try {
        // Simulate upload with progress (replace with real axiosInstance call)
        await simulateUpload((progress) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, progress } : f))
          )
        })

        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'success', progress: 100 } : f))
        )
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: 'error', errorMessage: 'Upload failed. Please try again.' }
              : f
          )
        )
      }
    }

    setIsUploading(false)
  }

  const allDone = files.length > 0 && files.every((f) => f.status === 'success')
  const hasErrors = files.some((f) => f.status === 'error')
  const canUpload =
    files.length > 0 && !isUploading && files.some((f) => f.status === 'idle')

  const handleClose = () => {
    if (isUploading) return
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl))
    setFiles([])
    setMetaMap({})
    setGlobalError(null)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 6 }}>
        <CloudUpload sx={{ color: 'secondary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Upload Photos
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
          ({files.length}/{MAX_FILES})
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={isUploading}
          sx={{ position: 'absolute', right: 12, top: 12 }}
          aria-label="Close upload dialog"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 2.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Global progress bar */}
          {isUploading && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Uploading {files.filter((f) => f.status !== 'success').length} photo(s)…
                </Typography>
                <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                  {Math.round(totalProgress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalProgress}
                color="secondary"
                sx={{ borderRadius: 1, height: 6 }}
              />
            </Box>
          )}

          {globalError && <Alert severity="error">{globalError}</Alert>}
          {allDone && (
            <Alert severity="success">
              All photos uploaded successfully! They will appear in the gallery shortly.
            </Alert>
          )}

          {/* Drop zone — hide when at max */}
          {files.length < MAX_FILES && (
            <DropZone
              onFilesAccepted={handleFilesAccepted}
              currentCount={files.length}
              disabled={isUploading}
            />
          )}

          {/* File list */}
          {files.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Photos ({files.length})
              </Typography>
              {files.map((item) => (
                <UploadPreviewCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onMetaChange={handleMetaChange}
                />
              ))}
            </Box>
          )}

          {files.length === 0 && (
            <Typography variant="body2" sx={{ color: 'text.disabled', textAlign: 'center' }}>
              No photos selected yet.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {hasErrors && !isUploading && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() =>
              setFiles((prev) =>
                prev.map((f) => (f.status === 'error' ? { ...f, status: 'idle', errorMessage: undefined } : f))
              )
            }
          >
            Retry Failed
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleClose} disabled={isUploading} color="inherit">
          {allDone ? 'Close' : 'Cancel'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!canUpload}
          onClick={handleUpload}
          startIcon={<CloudUpload />}
        >
          Upload {files.filter((f) => f.status === 'idle').length > 0
            ? `${files.filter((f) => f.status === 'idle').length} Photo${files.filter((f) => f.status === 'idle').length !== 1 ? 's' : ''}`
            : ''}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Simulates upload progress — swap out for real API call when backend is ready
async function simulateUpload(onProgress: (p: number) => void): Promise<void> {
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5
      if (progress >= 100) {
        clearInterval(interval)
        onProgress(100)
        resolve()
      } else {
        onProgress(Math.min(progress, 95))
      }
    }, 150)
  })
}
