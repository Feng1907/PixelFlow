import http from 'http'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'

import { env } from './config/env'
import { connectDB } from './config/database'
import { initSocket } from './socket'
import { connectRedis } from './config/redis'
import apiRouter from './routes/index'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

// ── Security ────────────────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  })
)

// ── Parsers ──────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Logging ──────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ── Swagger docs ─────────────────────────────────────────────────
const swaggerDoc = YAML.load(path.join(__dirname, '..', 'swagger.yaml')) as object
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

// ── API routes ───────────────────────────────────────────────────
app.use('/api', apiRouter)

// ── 404 ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Error handler ────────────────────────────────────────────────
app.use(errorHandler)

// ── Start ────────────────────────────────────────────────────────
async function start() {
  await connectDB()

  // Redis is optional in dev — don't crash if unavailable
  try {
    await connectRedis()
  } catch {
    console.warn('[Redis] Could not connect — running without cache')
  }

  const httpServer = http.createServer(app)
  initSocket(httpServer)

  httpServer.listen(env.PORT, () => {
    console.log(`[Server] Running on http://localhost:${env.PORT}`)
    console.log(`[Docs]   Swagger UI → http://localhost:${env.PORT}/api-docs`)
  })
}

start().catch((err) => {
  console.error('[Fatal]', err)
  process.exit(1)
})
