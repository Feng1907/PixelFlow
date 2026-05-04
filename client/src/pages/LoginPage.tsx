import { Box, Container, Paper } from '@mui/material'
import LoginForm from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <LoginForm />
        </Paper>
      </Container>
    </Box>
  )
}
