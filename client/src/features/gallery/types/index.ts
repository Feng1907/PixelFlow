import { z } from 'zod'
import type { ExifData } from '@/types/photo'

export type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'success' | 'error'

export interface UploadFile {
  id: string
  file: File
  previewUrl: string
  compressedFile?: File
  exif?: ExifData
  status: UploadStatus
  progress: number
  errorMessage?: string
}

export const photoMetaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Max 100 characters'),
  description: z.string().max(500, 'Max 500 characters').optional(),
  tags: z.string().optional(),
  album: z.string().optional(),
})

export type PhotoMetaValues = z.infer<typeof photoMetaSchema>

export const ACCEPTED_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/heic': ['.heic'],
  'image/tiff': ['.tiff', '.tif'],
}

export const MAX_FILE_SIZE_MB = 20
export const MAX_FILES = 10
