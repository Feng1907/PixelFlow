import { createClient } from 'redis'
import { env } from './env'

export const redisClient = createClient({ url: env.REDIS_URL })

redisClient.on('error', (err) => console.error('[Redis] Error:', err))
redisClient.on('connect', () => console.log('[Redis] Connected'))

export async function connectRedis(): Promise<void> {
  await redisClient.connect()
}
