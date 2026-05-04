import { useState, useCallback, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Photo } from '@/types/photo'
import { getMockPage } from '../services/mockPhotos'

const PAGE_SIZE = 8

interface UseMasonryPhotosReturn {
  photos: Photo[]
  isLoading: boolean
  isFetchingMore: boolean
  hasMore: boolean
  sentinelRef: (node?: Element | null) => void
  reset: () => void
}

export function useMasonryPhotos(): UseMasonryPhotosReturn {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const { ref: sentinelRef, inView } = useInView({ threshold: 0.1, rootMargin: '300px' })

  const loadPage = useCallback(async (pageNum: number, isFirst = false) => {
    if (isFirst) setIsLoading(true)
    else setIsFetchingMore(true)

    // Simulate network latency for realistic demo
    await new Promise((r) => setTimeout(r, 600))

    const { photos: newPhotos, hasMore: more } = getMockPage(pageNum, PAGE_SIZE)

    setPhotos((prev) => (isFirst ? newPhotos : [...prev, ...newPhotos]))
    setHasMore(more)

    if (isFirst) setIsLoading(false)
    else setIsFetchingMore(false)
  }, [])

  // Initial load
  useEffect(() => {
    void loadPage(1, true)
  }, [loadPage])

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasMore && !isLoading && !isFetchingMore) {
      const nextPage = page + 1
      setPage(nextPage)
      void loadPage(nextPage)
    }
  }, [inView, hasMore, isLoading, isFetchingMore, page, loadPage])

  const reset = useCallback(() => {
    setPhotos([])
    setPage(1)
    setHasMore(true)
    void loadPage(1, true)
  }, [loadPage])

  return { photos, isLoading, isFetchingMore, hasMore, sentinelRef, reset }
}
