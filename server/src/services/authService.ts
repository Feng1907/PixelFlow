import User from '../models/User'
import { AppError } from '../middlewares/errorHandler'
import { signAccessToken, signRefreshToken } from '../utils/jwt'
import type { IUser } from '../models/User'

interface RegisterDto {
  username: string
  email: string
  password: string
  displayName: string
}

interface LoginDto {
  email: string
  password: string
}

interface AuthResult {
  user: IUser
  accessToken: string
  refreshToken: string
}

export const authService = {
  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await User.findOne({
      $or: [{ email: dto.email }, { username: dto.username }],
    })
    if (existing) {
      const field = existing.email === dto.email ? 'email' : 'username'
      throw new AppError(`This ${field} is already taken`, 409)
    }

    const user = await User.create(dto)
    const payload = { userId: user._id.toString(), email: user.email }

    return {
      user,
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    }
  },

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await User.findOne({ email: dto.email }).select('+password')
    if (!user) throw new AppError('Invalid email or password', 401)

    const valid = await user.comparePassword(dto.password)
    if (!valid) throw new AppError('Invalid email or password', 401)

    const payload = { userId: user._id.toString(), email: user.email }

    return {
      user,
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    }
  },
}
