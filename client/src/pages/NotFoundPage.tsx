import { Box, Container, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontWeight: 700, color: 'secondary.main' }}>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </Box>
    </Container>
  )
}
