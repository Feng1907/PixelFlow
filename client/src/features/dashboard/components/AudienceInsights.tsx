import { Card, Typography, Box, useTheme } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const DEVICE_DATA = [
  { name: 'Mobile', value: 58 },
  { name: 'Desktop', value: 32 },
  { name: 'Tablet', value: 10 },
]

const PEAK_HOURS = [
  { hour: '8AM', views: 120 },
  { hour: '12PM', views: 340 },
  { hour: '3PM', views: 280 },
  { hour: '6PM', views: 510 },
  { hour: '9PM', views: 390 },
]

export default function AudienceInsights() {
  const theme = useTheme()
  const COLORS = [theme.palette.secondary.main, theme.palette.primary.light, '#ff9800']

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Audience Insights</Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Device breakdown */}
        <Box sx={{ flex: 1, minWidth: 160 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Device Breakdown
          </Typography>
          <Box sx={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DEVICE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                  dataKey="value" paddingAngle={3}>
                  {DEVICE_DATA.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${String(v)}%`]}
                  contentStyle={{ background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8, fontSize: 12 }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Peak hours */}
        <Box sx={{ flex: 1, minWidth: 160 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
            Peak Viewing Hours
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {PEAK_HOURS.map(({ hour, views }) => (
              <Box key={hour} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', width: 36 }}>{hour}</Typography>
                <Box sx={{ flex: 1, bgcolor: 'action.hover', borderRadius: 1, height: 8, overflow: 'hidden' }}>
                  <Box sx={{ width: `${(views / 510) * 100}%`, bgcolor: 'secondary.main', height: '100%', borderRadius: 1, transition: 'width 0.4s ease' }} />
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', width: 28, textAlign: 'right' }}>{views}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
