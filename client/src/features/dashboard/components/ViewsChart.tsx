import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, Box, Typography, useTheme } from '@mui/material'

function generateWeekData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day) => ({
    day,
    views: Math.floor(Math.random() * 800 + 200),
    likes: Math.floor(Math.random() * 120 + 20),
  }))
}

const DATA = generateWeekData()

export default function ViewsChart() {
  const theme = useTheme()

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>
        Views & Likes — Last 7 Days
      </Typography>
      <Box sx={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="likesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.light} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme.palette.primary.light} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke={theme.palette.secondary.main}
              strokeWidth={2}
              fill="url(#viewsGrad)"
              name="Views"
            />
            <Area
              type="monotone"
              dataKey="likes"
              stroke={theme.palette.primary.light}
              strokeWidth={2}
              fill="url(#likesGrad)"
              name="Likes"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  )
}
