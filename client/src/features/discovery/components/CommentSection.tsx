import { useState, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Avatar,
  Typography,
  Skeleton,
  Divider,
} from '@mui/material'
import { Send } from '@mui/icons-material'
import { getSocket } from '@/services/socket'
import { useAppSelector } from '@/store'

interface CommentAuthor {
  username: string
  displayName: string
  avatar?: string
}

interface Comment {
  _id: string
  text: string
  author: CommentAuthor
  createdAt: string
}

interface CommentSectionProps {
  photoId: string
  initialCount?: number
}

export default function CommentSection({ photoId, initialCount = 0 }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [loading] = useState(false)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const socket = getSocket()
    socket.emit('photo:join', photoId)

    socket.on('photo:commented', (data: { photoId: string; comment: Comment }) => {
      if (data.photoId === photoId) {
        setComments((prev) => [...prev, data.comment])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      }
    })

    return () => {
      socket.emit('photo:leave', photoId)
      socket.off('photo:commented')
    }
  }, [photoId])

  const submit = () => {
    if (!text.trim() || !isAuthenticated) return
    getSocket().emit('photo:comment', { photoId, text: text.trim() })
    setText('')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
        Comments {initialCount > 0 && `(${initialCount})`}
      </Typography>

      {/* Comment list */}
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
        {loading && [1, 2].map((i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="40%" height={14} />
              <Skeleton width="80%" height={14} />
            </Box>
          </Box>
        ))}

        {!loading && comments.length === 0 && (
          <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center', py: 2 }}>
            No comments yet. Be the first!
          </Typography>
        )}

        {comments.map((c) => (
          <Box key={c._id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Avatar src={c.author.avatar} sx={{ width: 28, height: 28, fontSize: '0.7rem' }}>
              {c.author.displayName[0]}
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {c.author.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                {c.text}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* Input */}
      {isAuthenticated ? (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Avatar src={user?.avatar} sx={{ width: 28, height: 28, fontSize: '0.7rem', flexShrink: 0 }}>
            {user?.displayName?.[0]}
          </Avatar>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
            placeholder="Add a comment…"
            size="small"
            fullWidth
            multiline
            maxRows={3}
            slotProps={{ input: { sx: { fontSize: '0.85rem' } } }}
          />
          <IconButton
            size="small"
            color="secondary"
            onClick={submit}
            disabled={!text.trim()}
            aria-label="Send comment"
          >
            <Send sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      ) : (
        <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Sign in to comment
        </Typography>
      )}
    </Box>
  )
}
