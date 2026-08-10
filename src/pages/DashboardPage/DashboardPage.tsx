import { useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks } from '@/store/tasks/task.actions';
import { selectAllTasks, selectTaskStats, selectTasksStatus } from '@/store/tasks/task.selectors';
import StatsOverview from './StatsOverview';
import TaskStatusChart from './TaskStatusChart';
import UserBreakdownTable from './UserBreakdownTable';
import Loader from '@/components/common/Loader';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const status = useAppSelector(selectTasksStatus);
  const stats = useAppSelector(selectTaskStats);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Translate status metrics for charting
  const chartData = useMemo(() => {
    return [
      { name: 'Completed', value: stats.completed },
      { name: 'In Progress', value: stats.inProgress },
      { name: 'Pending', value: stats.pending },
    ];
  }, [stats]);

  if (status === 'loading' && tasks.length === 0) {
    return <Loader />;
  }

  const isAdmin = user?.role === 'admin';

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
