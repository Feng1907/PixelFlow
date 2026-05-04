import { useState, useRef } from 'react'
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Skeleton,
  Chip,
  Divider,
} from '@mui/material'
import {
  Edit,
  CameraAlt,
  Language,
  PhotoLibrary,
  PeopleAlt,
  PersonAdd,
} from '@mui/icons-material'
import type { User } from '@/types/user'
import { useAppSelector } from '@/store'
import { useUploadAvatar } from '../hooks/useProfile'
import EditProfileDialog from './EditProfileDialog'

interface ProfileHeaderProps {
  user: User
  isLoading?: boolean
}

export default function ProfileHeader({ user, isLoading }: ProfileHeaderProps) {
  const [editOpen, setEditOpen] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const { mutate: uploadAvatar, isPending: uploadingAvatar } = useUploadAvatar()

  const isOwner = currentUser?._id === user._id

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadAvatar(file)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', py: 4 }}>
        <Skeleton variant="circular" width={120} height={120} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width={200} height={36} />
          <Skeleton width={140} height={24} sx={{ mt: 1 }} />
          <Skeleton width="60%" height={20} sx={{ mt: 2 }} />
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: { xs: 2, sm: 4 }, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              src={user.avatar}
              alt={user.displayName}
              sx={{ width: 120, height: 120, fontSize: '2.5rem', border: 3, borderColor: 'divider' }}
            >
              {user.displayName[0]}
            </Avatar>
            {isOwner && (
              <Tooltip title="Change photo">
                <IconButton
                  size="small"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  aria-label="Change avatar"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'secondary.main',
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': { bgcolor: 'secondary.dark' },
                  }}
                >
                  <CameraAlt sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
              aria-label="Upload avatar"
            />
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.displayName}
              </Typography>
              <Chip
                label={`@${user.username}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>

            {user.bio && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5, maxWidth: 500 }}>
                {user.bio}
              </Typography>
            )}

            {user.website && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                <Language sx={{ fontSize: 16, color: 'secondary.main' }} />
                <Typography
                  component="a"
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={{ color: 'secondary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  {user.website.replace(/^https?:\/\//, '')}
                </Typography>
              </Box>
            )}

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 3, mb: 2.5, flexWrap: 'wrap' }}>
              {[
                { icon: <PhotoLibrary sx={{ fontSize: 18 }} />, value: user.photosCount, label: 'Photos' },
                { icon: <PeopleAlt sx={{ fontSize: 18 }} />, value: user.followersCount, label: 'Followers' },
                { icon: <PeopleAlt sx={{ fontSize: 18 }} />, value: user.followingCount, label: 'Following' },
              ].map(({ icon, value, label }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
                  <Typography sx={{ fontWeight: 700 }}>{value.toLocaleString()}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
                </Box>
              ))}
            </Box>

            {/* Actions */}
            {isOwner ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditOpen(true)}
                size="small"
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PersonAdd />}
                size="small"
              >
                Follow
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ mt: 4 }} />
      </Box>

      {isOwner && (
        <EditProfileDialog
          open={editOpen}
          user={user}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  )
}
