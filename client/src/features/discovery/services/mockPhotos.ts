import type { Photo } from '@/types/photo'

// Unsplash public collection — no API key needed for demo
const UNSPLASH_PHOTOS: Array<{ id: string; width: number; height: number; keyword: string }> = [
  { id: 'photo-1506905925346-21bda4d32df4', width: 1080, height: 1620, keyword: 'mountain' },
  { id: 'photo-1501854140801-50d01698950b', width: 1080, height: 720, keyword: 'landscape' },
  { id: 'photo-1470071459604-3b5ec3a7fe05', width: 1080, height: 1440, keyword: 'fog' },
  { id: 'photo-1441974231531-c6227db76b6e', width: 1080, height: 810, keyword: 'forest' },
  { id: 'photo-1518020382113-a7e8fc38eac9', width: 1080, height: 1350, keyword: 'dog' },
  { id: 'photo-1529778873920-4da4926a72c2', width: 1080, height: 810, keyword: 'cat' },
  { id: 'photo-1477959858617-67f85cf4f1df', width: 1080, height: 720, keyword: 'city' },
  { id: 'photo-1480714378408-67cf0d13bc1b', width: 1080, height: 1440, keyword: 'street' },
  { id: 'photo-1519501025264-65ba15a82390', width: 1080, height: 810, keyword: 'bridge' },
  { id: 'photo-1514924013411-cbf25faa35bb', width: 1080, height: 1350, keyword: 'night' },
  { id: 'photo-1531804055935-76f44d7c3621', width: 1080, height: 810, keyword: 'portrait' },
  { id: 'photo-1531746020798-e6953c6e8e04', width: 1080, height: 1620, keyword: 'face' },
  { id: 'photo-1502767089025-6572583495b9', width: 1080, height: 720, keyword: 'ocean' },
  { id: 'photo-1505118380757-91f5f5632de0', width: 1080, height: 1440, keyword: 'wave' },
  { id: 'photo-1507525428034-b723cf961d3e', width: 1080, height: 810, keyword: 'beach' },
  { id: 'photo-1444927714506-8492d94b4e3d', width: 1080, height: 1350, keyword: 'flower' },
  { id: 'photo-1490750967868-88df5691cc82', width: 1080, height: 810, keyword: 'rose' },
  { id: 'photo-1462275646964-a0e3386b89fa', width: 1080, height: 1620, keyword: 'macro' },
  { id: 'photo-1519681393784-d120267933ba', width: 1080, height: 720, keyword: 'snow' },
  { id: 'photo-1507003211169-0a1dd7228f2d', width: 1080, height: 1350, keyword: 'people' },
]

const CAMERAS = ['Sony A7 IV', 'Canon EOS R5', 'Nikon Z6 II', 'Fujifilm X-T5', 'Leica M11']
const LENSES = ['24-70mm f/2.8', '50mm f/1.4', '85mm f/1.8', '16-35mm f/4', '100mm Macro']
const LOCATIONS = ['Hà Nội', 'Đà Lạt', 'Hội An', 'Sapa', 'Tokyo', 'Paris', 'New York', 'Iceland']
const AUTHORS = [
  { _id: 'u1', username: 'anphong', displayName: 'An Phong', avatar: undefined },
  { _id: 'u2', username: 'quangminh', displayName: 'Quang Minh', avatar: undefined },
  { _id: 'u3', username: 'thuhang', displayName: 'Thu Hằng', avatar: undefined },
  { _id: 'u4', username: 'ductrung', displayName: 'Đức Trung', avatar: undefined },
]

function rand(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function makePhoto(item: (typeof UNSPLASH_PHOTOS)[0], index: number): Photo {
  const author = AUTHORS[index % AUTHORS.length]
  return {
    _id: `mock-${item.id}`,
    title: `${item.keyword.charAt(0).toUpperCase() + item.keyword.slice(1)} #${index + 1}`,
    imageUrl: `https://images.unsplash.com/${item.id}?auto=format&fit=crop&w=800&q=80`,
    thumbnailUrl: `https://images.unsplash.com/${item.id}?auto=format&fit=crop&w=400&q=70`,
    author,
    tags: [item.keyword, 'photography', '35mm'],
    exif: {
      camera: rand(CAMERAS),
      lens: rand(LENSES),
      aperture: `f/${(Math.random() * 3 + 1.4).toFixed(1)}`,
      shutterSpeed: `1/${Math.pow(2, Math.floor(Math.random() * 8 + 4))}s`,
      iso: [100, 200, 400, 800, 1600][Math.floor(Math.random() * 5)],
      location: rand(LOCATIONS),
    },
    likesCount: Math.floor(Math.random() * 500),
    commentsCount: Math.floor(Math.random() * 50),
    viewsCount: Math.floor(Math.random() * 5000),
    isLiked: Math.random() > 0.7,
    createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString(),
  }
}

export const MOCK_PHOTOS: Photo[] = UNSPLASH_PHOTOS.map(makePhoto)

export function getMockPage(page: number, limit = 8): { photos: Photo[]; hasMore: boolean } {
  // Cycle through mock data to simulate infinite scroll
  const start = ((page - 1) * limit) % MOCK_PHOTOS.length
  const photos: Photo[] = []
  for (let i = 0; i < limit; i++) {
    const src = MOCK_PHOTOS[(start + i) % MOCK_PHOTOS.length]
    photos.push({ ...src, _id: `${src._id}-p${page}-${i}` })
  }
  return { photos, hasMore: page < 10 }
}
