import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAppDispatch } from '@/store'
import { setUser, clearUser } from '@/store/slices/authSlice'
import type { LoginFormValues, RegisterFormValues } from '../types'

export function useLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: LoginFormValues) => authService.login(credentials),
    onSuccess: ({ user }) => {
      dispatch(setUser(user))
      navigate('/discover')
    },
  })
}

export function useRegister() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ confirmPassword: _cp, ...payload }: RegisterFormValues) =>
      authService.register(payload),
    onSuccess: ({ user }) => {
      dispatch(setUser(user))
      navigate('/discover')
    },
  })
}

export function useLogout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch(clearUser())
      navigate('/login')
    },
  })
}
