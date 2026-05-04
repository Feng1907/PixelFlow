import { Grid, Container, Typography, Box, Button } from '@mui/material'
import {
  Visibility,
  Favorite,
  PeopleAlt,
  PhotoLibrary,
  AddAPhoto,
} from '@mui/icons-material'
import { useAppSelector } from '@/store'
import StatsCard from '@/features/dashboard/components/StatsCard'
import ViewsChart from '@/features/dashboard/components/ViewsChart'
import TopPhotosTable from '@/features/dashboard/components/TopPhotosTable'
import { useState } from 'react'
import UploadDialog from '@/features/gallery/components/UploadDialog'

const STATS = [
  { label: 'Total Views', value: 12_430, delta: 18, Icon: Visibility, color: '#2196f3' },
  { label: 'Total Likes', value: 3_217, delta: 7, Icon: Favorite, color: '#e94560' },
  { label: 'Followers', value: 248, delta: 12, Icon: PeopleAlt, color: '#4caf50' },
  { label: 'Photos', value: 34, delta: 2, Icon: PhotoLibrary, color: '#ff9800' },
]

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
            Welcome back, {user?.displayName ?? 'Photographer'} 👋
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddAPhoto />}
          onClick={() => setUploadOpen(true)}
        >
          Upload Photo
        </Button>
      </Box>

      {/* Stats row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {STATS.map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatsCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ViewsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TopPhotosTable />
        </Grid>
      </Grid>

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </Container>
  )
}
