import { Box, Typography } from '@mui/material';
import { useDashboardPage } from './hooks/useDashboardPage';
import StatsOverview from './StatsOverview';
import TaskStatusChart from './TaskStatusChart';
import UserBreakdownTable from './UserBreakdownTable';
import Loader from '@/components/common/Loader';

export default function DashboardPage() {
  const { tasks, stats, chartData, isAdmin, isLoading } = useDashboardPage();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time metrics and task statuses.
        </Typography>
      </Box>

      <StatsOverview stats={stats} />

      <Box sx={{ mb: 4 }}>
        <TaskStatusChart data={chartData} />
      </Box>

      {isAdmin && <UserBreakdownTable tasks={tasks} />}
    </Box>
  );
}
