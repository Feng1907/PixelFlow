import { Box, Typography, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          Showcase Your Vision
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 600 }}>
          PixelFlow is where photographers share stories through light, shadow, and composition.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/discover')}
          >
            Explore Photos
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/register')}>
            Start Portfolio
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
