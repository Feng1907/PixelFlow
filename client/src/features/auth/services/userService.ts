import axiosInstance from '@/services/axiosInstance'
import type { ApiResponse } from '@/types/api'
import type { User } from '@/types/user'

export interface UpdateProfileDto {
  displayName?: string
  bio?: string
  website?: string
}

export const userService = {
  async getByUsername(username: string): Promise<User> {
    const { data } = await axiosInstance.get<ApiResponse<{ user: User }>>(`/users/${username}`)
    return data.data.user
  },

  async updateProfile(dto: UpdateProfileDto): Promise<User> {
    const { data } = await axiosInstance.patch<ApiResponse<{ user: User }>>('/users/me', dto)
    return data.data.user
  },

  async uploadAvatar(file: File): Promise<User> {
    const form = new FormData()
    form.append('avatar', file)
    const { data } = await axiosInstance.post<ApiResponse<{ user: User }>>(
      '/users/me/avatar',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return data.data.user
  },
}
