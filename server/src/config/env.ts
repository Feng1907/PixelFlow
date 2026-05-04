import dotenv from 'dotenv'
dotenv.config()

function required(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required env var: ${key}`)
  return val
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback
}

export const env = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '5000'), 10),
  MONGODB_URI: optional('MONGODB_URI', 'mongodb://localhost:27017/pixelflow'),
  REDIS_URL: optional('REDIS_URL', 'redis://localhost:6379'),
  JWT_SECRET: optional('JWT_SECRET', 'dev_jwt_secret_change_me'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '7d'),
  JWT_REFRESH_SECRET: optional('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
  JWT_REFRESH_EXPIRES_IN: optional('JWT_REFRESH_EXPIRES_IN', '30d'),
  CLOUDINARY_CLOUD_NAME: optional('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: optional('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: optional('CLOUDINARY_API_SECRET', ''),
  CLIENT_URL: optional('CLIENT_URL', 'http://localhost:3000'),
} as const

// Validate cloudinary only when not in test env
if (env.NODE_ENV === 'production') {
  required('CLOUDINARY_CLOUD_NAME')
  required('CLOUDINARY_API_KEY')
  required('CLOUDINARY_API_SECRET')
  required('JWT_SECRET')
}
