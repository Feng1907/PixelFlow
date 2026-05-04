import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService, type UpdateProfileDto } from '../services/userService'
import { useAppDispatch } from '@/store'
import { setUser } from '@/store/slices/authSlice'

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => userService.getByUsername(username),
    enabled: !!username,
  })
}

export function useUpdateProfile() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => userService.updateProfile(dto),
    onSuccess: (user) => {
      dispatch(setUser(user))
      void queryClient.invalidateQueries({ queryKey: ['profile', user.username] })
    },
  })
}

export function useUploadAvatar() {
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: (user) => {
      dispatch(setUser(user))
    },
  })
}
