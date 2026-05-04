import { useState } from 'react'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material'
import { Visibility, VisibilityOff, CameraAlt } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { loginSchema, type LoginFormValues } from '../types'
import { useLogin } from '../hooks/useAuth'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (values: LoginFormValues) => {
    login(values)
  }

  const apiError =
    error && 'response' in error
      ? (error.response as { data?: { message?: string } })?.data?.message
      : null

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
      noValidate
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CameraAlt sx={{ color: 'secondary.main', fontSize: 32 }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          PixelFlow
        </Typography>
      </Box>

      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Welcome back
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
          Sign in to your account to continue
        </Typography>
      </Box>

      {apiError && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {apiError}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        fullWidth
        error={!!errors.password}
        helperText={errors.password?.message}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        {...register('password')}
      />

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        size="large"
        fullWidth
        disabled={isPending}
        sx={{ py: 1.5 }}
      >
        {isPending ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>

      <Divider sx={{ my: 0.5 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', px: 1 }}>
          OR
        </Typography>
      </Divider>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Don&apos;t have an account?{' '}
        <MuiLink component={Link as React.ElementType} to="/register" sx={{ color: 'secondary.main', fontWeight: 600 }}>
          Sign up
        </MuiLink>
      </Typography>
    </Box>
  )
}
