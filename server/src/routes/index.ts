import { Router } from 'express'
import authRouter from './auth'
import photosRouter from './photos'

const router = Router()

router.use('/auth', authRouter)
router.use('/photos', photosRouter)

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'PixelFlow API is running', timestamp: new Date() })
})

export default router
