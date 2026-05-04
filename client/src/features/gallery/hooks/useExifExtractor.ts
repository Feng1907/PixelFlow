import { useCallback } from 'react'
import type { ExifData } from '@/types/photo'

// Lazy-load exifr to avoid blocking the main bundle
async function loadExifr() {
  const { default: exifr } = await import('exifr')
  return exifr
}

function formatShutter(val: number): string {
  if (val >= 1) return `${val}s`
  const denom = Math.round(1 / val)
  return `1/${denom}s`
}

function formatAperture(val: number): string {
  return `f/${val.toFixed(1)}`
}

export function useExifExtractor() {
  const extract = useCallback(async (file: File): Promise<ExifData> => {
    try {
      const exifr = await loadExifr()
      const raw = await exifr.parse(file, {
        pick: [
          'Make', 'Model', 'LensModel', 'FNumber', 'ExposureTime',
          'ISO', 'FocalLength', 'DateTimeOriginal',
          'GPSLatitude', 'GPSLongitude', 'GPSAltitude',
        ],
      })

      if (!raw) return {}

      const camera =
        raw.Make && raw.Model
          ? `${String(raw.Make).trim()} ${String(raw.Model).trim()}`
          : raw.Model
            ? String(raw.Model)
            : undefined

      return {
        camera,
        lens: raw.LensModel ? String(raw.LensModel).trim() : undefined,
        aperture: raw.FNumber ? formatAperture(Number(raw.FNumber)) : undefined,
        shutterSpeed: raw.ExposureTime ? formatShutter(Number(raw.ExposureTime)) : undefined,
        iso: raw.ISO ? Number(raw.ISO) : undefined,
        focalLength: raw.FocalLength ? `${Number(raw.FocalLength).toFixed(0)}mm` : undefined,
        takenAt: raw.DateTimeOriginal
          ? new Date(raw.DateTimeOriginal as string).toISOString()
          : undefined,
      }
    } catch {
      // EXIF not available for this file — non-fatal
      return {}
    }
  }, [])

  return { extract }
}
