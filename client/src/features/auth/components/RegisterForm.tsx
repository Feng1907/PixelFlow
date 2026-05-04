import { useState } from 'react'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link as MuiLink,
  Grid,
} from '@mui/material'
import { Visibility, VisibilityOff, CameraAlt } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { registerSchema, type RegisterFormValues } from '../types'
import { useRegister } from '../hooks/useAuth'

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate: register, isPending, error } = useRegister()

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')
  const passwordStrength = getPasswordStrength(password)

  const onSubmit = (values: RegisterFormValues) => {
    register(values)
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
          Create your account
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
          Start showcasing your photography today
        </Typography>
      </Box>

      {apiError && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {apiError}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            label="Display Name"
            autoComplete="name"
            autoFocus
            fullWidth
            error={!!errors.displayName}
            helperText={errors.displayName?.message}
            {...rhfRegister('displayName')}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Username"
            autoComplete="username"
            fullWidth
            error={!!errors.username}
            helperText={errors.username?.message ?? '@username will be your public portfolio URL'}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ color: 'text.secondary' }}>@</Typography>
                  </InputAdornment>
                ),
              },
            }}
            {...rhfRegister('username')}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            {...rhfRegister('email')}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
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
            {...rhfRegister('password')}
          />
          {/* Password strength bar */}
          {password.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
              {[1, 2, 3, 4].map((level) => (
                <Box
                  key={level}
                  sx={{
                    height: 4,
                    flex: 1,
                    borderRadius: 2,
                    bgcolor:
                      passwordStrength.score >= level
                        ? passwordStrength.color
                        : 'action.disabled',
                    transition: 'background-color 0.3s',
                  }}
                />
              ))}
              <Typography variant="caption" sx={{ color: passwordStrength.color, ml: 1 }}>
                {passwordStrength.label}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid size={12}>
          <TextField
            label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm((prev) => !prev)}
                      edge="end"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            {...rhfRegister('confirmPassword')}
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        size="large"
        fullWidth
        disabled={isPending}
        sx={{ py: 1.5 }}
      >
        {isPending ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
      </Button>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Already have an account?{' '}
        <MuiLink component={Link as React.ElementType} to="/login" sx={{ color: 'secondary.main', fontWeight: 600 }}>
          Sign in
        </MuiLink>
      </Typography>
    </Box>
  )
}

function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { label: 'Weak', color: '#f44336' },
    { label: 'Fair', color: '#ff9800' },
    { label: 'Good', color: '#2196f3' },
    { label: 'Strong', color: '#4caf50' },
  ]

  return { score, ...(levels[score - 1] ?? { label: 'Weak', color: '#f44336' }) }
}
