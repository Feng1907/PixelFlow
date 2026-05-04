import axiosInstance from '@/services/axiosInstance'
import type { ApiResponse } from '@/types/api'
import type { User } from '@/types/user'
import type { LoginFormValues, RegisterFormValues } from '../types'

interface AuthResponse {
  user: User
  accessToken: string
}

export const authService = {
  async login(credentials: LoginFormValues): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    )
    return data.data
  },

  async register(payload: Omit<RegisterFormValues, 'confirmPassword'>): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      payload
    )
    return data.data
  },

  async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout')
  },

  async getMe(): Promise<User> {
    const { data } = await axiosInstance.get<ApiResponse<User>>('/auth/me')
    return data.data
  },
}
