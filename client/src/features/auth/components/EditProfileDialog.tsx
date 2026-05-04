import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useUpdateProfile } from '../hooks/useProfile'
import type { User } from '@/types/user'

const schema = z.object({
  displayName: z.string().min(2, 'At least 2 characters').max(50),
  bio: z.string().max(300, 'Max 300 characters').optional(),
  website: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
})

type FormValues = z.infer<typeof schema>

interface EditProfileDialogProps {
  open: boolean
  user: User
  onClose: () => void
}

export default function EditProfileDialog({ open, user, onClose }: EditProfileDialogProps) {
  const { mutate, isPending, error } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio ?? '',
      website: user.website ?? '',
    },
  })

  const onSubmit = (values: FormValues) => {
    mutate(
      { ...values, website: values.website || undefined },
      { onSuccess: onClose }
    )
  }

  const apiError =
    error && 'response' in error
      ? (error.response as { data?: { message?: string } })?.data?.message
      : null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Edit Profile</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="edit-profile-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}
          noValidate
        >
          {apiError && <Alert severity="error">{apiError}</Alert>}
          <TextField
            label="Display Name"
            fullWidth
            error={!!errors.displayName}
            helperText={errors.displayName?.message}
            {...register('displayName')}
          />
          <TextField
            label="Bio"
            fullWidth
            multiline
            rows={3}
            placeholder="Tell the world about your photography style…"
            error={!!errors.bio}
            helperText={errors.bio?.message}
            {...register('bio')}
          />
          <TextField
            label="Website"
            fullWidth
            placeholder="https://yoursite.com"
            error={!!errors.website}
            helperText={errors.website?.message}
            {...register('website')}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit" disabled={isPending}>Cancel</Button>
        <Button
          type="submit"
          form="edit-profile-form"
          variant="contained"
          color="secondary"
          disabled={isPending}
        >
          {isPending ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
