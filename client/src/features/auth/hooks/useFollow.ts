import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/services/axiosInstance'
import type { ApiResponse } from '@/types/api'

interface FollowResult {
  following: boolean
  followersCount: number
}

export function useFollow(username: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post<ApiResponse<FollowResult>>(
        `/users/${username}/follow`
      )
      return data.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', username] })
    },
  })
}
