import { Router } from 'express'
import { z } from 'zod'
import { authController } from '../controllers/authController'
import { authenticate } from '../middlewares/authenticate'
import { validate } from '../middlewares/validate'

const router = Router()

const registerSchema = z.object({
  displayName: z.string().min(2).max(50),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [displayName, username, email, password]
 *             properties:
 *               displayName: { type: string }
 *               username: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201: { description: User created }
 *       409: { description: Email or username taken }
 */
router.post('/register', validate(registerSchema), authController.register)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post('/login', validate(loginSchema), authController.login)

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout
 *     responses:
 *       200: { description: Logged out }
 */
router.post('/logout', authController.logout)

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Current user }
 *       401: { description: Unauthorized }
 */
router.get('/me', authenticate, authController.getMe)

export default router
