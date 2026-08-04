import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface TaskStatusChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#2e7d32', '#ed6c02', '#475569'];

export default function TaskStatusChart({ data }: TaskStatusChartProps) {
  const hasData = data.some((item) => item.value > 0);

  return (
    <Card sx={{ height: 350, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Task Status Breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Visualizing current tasks grouped by execution status.
        </Typography>

        {!hasData ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              No task data available to render chart.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, width: '100%', height: '100%', minHeight: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
