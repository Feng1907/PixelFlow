import { Box, Card, Typography, type SvgIconProps } from '@mui/material'
import type { ElementType } from 'react'

interface StatsCardProps {
  label: string
  value: number
  delta?: number
  Icon: ElementType<SvgIconProps>
  color?: string
}

export default function StatsCard({ label, value, delta, Icon, color = '#e94560' }: StatsCardProps) {
  const isPositive = (delta ?? 0) >= 0

  return (
    <Card
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5, height: '100%' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {value.toLocaleString()}
          </Typography>
          {delta !== undefined && (
            <Typography
              variant="caption"
              sx={{ color: isPositive ? 'success.main' : 'error.main', fontWeight: 600 }}
            >
              {isPositive ? '▲' : '▼'} {Math.abs(delta)}% vs last week
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${color}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ color, fontSize: 24 }} />
        </Box>
      </Box>
    </Card>
  )
}
