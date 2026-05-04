import { Router } from 'express'
import multer from 'multer'
import { photoController } from '../controllers/photoController'
import { authenticate, optionalAuth } from '../middlewares/authenticate'

const router = Router()

// Store file in memory — we stream it to Cloudinary manually
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/tiff']
    cb(null, allowed.includes(file.mimetype))
  },
})

/**
 * @openapi
 * /photos:
 *   get:
 *     tags: [Photos]
 *     summary: Get paginated photos
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [latest, popular, trending] }
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of photos }
 */
router.get('/', optionalAuth, photoController.getMany)

/**
 * @openapi
 * /photos/{id}:
 *   get:
 *     tags: [Photos]
 *     summary: Get photo by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Photo details }
 *       404: { description: Not found }
 */
router.get('/:id', optionalAuth, photoController.getById)

/**
 * @openapi
 * /photos:
 *   post:
 *     tags: [Photos]
 *     summary: Upload a photo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, title]
 *             properties:
 *               file: { type: string, format: binary }
 *               title: { type: string }
 *               description: { type: string }
 *               tags: { type: string }
 *               exif: { type: string, description: JSON string of EXIF data }
 *     responses:
 *       201: { description: Photo created }
 */
router.post('/', authenticate, upload.single('file'), photoController.upload)

/**
 * @openapi
 * /photos/{id}/like:
 *   post:
 *     tags: [Photos]
 *     summary: Toggle like on a photo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Like toggled }
 */
router.post('/:id/like', authenticate, photoController.toggleLike)

/**
 * @openapi
 * /photos/{id}:
 *   delete:
 *     tags: [Photos]
 *     summary: Delete a photo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 *       403: { description: Forbidden }
 */
router.delete('/:id', authenticate, photoController.delete)

export default router
