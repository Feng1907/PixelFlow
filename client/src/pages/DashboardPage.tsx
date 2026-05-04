import { Box, Container, Typography } from '@mui/material'
import { useAppSelector } from '@/store'

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Dashboard
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Welcome back, {user?.displayName ?? 'Photographer'} — analytics coming soon.
        </Typography>
      </Box>
    </Container>
  )
}
