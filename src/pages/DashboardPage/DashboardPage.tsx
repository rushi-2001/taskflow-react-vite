import { useEffect, useMemo } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchTasks,
  selectAllTasks,
  selectTaskStats,
  selectTasksStatus,
} from '@/features/tasks/taskSlice';
import StatsOverview from './StatsOverview';
import TaskStatusChart from './TaskStatusChart';
import UserBreakdownTable from './UserBreakdownTable';
import StackPriorityRow from './StackPriorityRow';
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

  // Compute priority breakdown metrics
  const priorityStats = useMemo(() => {
    const high = tasks.filter((t) => t.priority === 'high').length;
    const medium = tasks.filter((t) => t.priority === 'medium').length;
    const low = tasks.filter((t) => t.priority === 'low').length;
    const total = high + medium + low || 1; // avoid divide by zero

    return {
      high,
      medium,
      low,
      highPercent: (high / total) * 100,
      mediumPercent: (medium / total) * 100,
      lowPercent: (low / total) * 100,
    };
  }, [tasks]);

  if (status === 'loading' && tasks.length === 0) {
    return <Loader />;
  }

  const isAdmin = user?.role === 'admin';

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}
        >
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time metrics, priorities breakdown, and task statuses.
        </Typography>
      </Box>

      {/* 5 Status Cards */}
      <StatsOverview stats={stats} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* Pie Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '2 2 0' }, minWidth: 0 }}>
          <TaskStatusChart data={chartData} />
        </Box>

        {/* Priority Breakdown Progress Bars */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 280 }}>
          <Card sx={{ height: 350, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Priority Distribution
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 4, display: 'block' }}>
                Breakdown of task volume by urgency priority level.
              </Typography>

              <StackPriorityRow
                label="High Priority"
                count={priorityStats.high}
                value={priorityStats.highPercent}
                color="#ef4444"
              />

              <StackPriorityRow
                label="Medium Priority"
                count={priorityStats.medium}
                value={priorityStats.mediumPercent}
                color="#f59e0b"
              />

              <StackPriorityRow
                label="Low Priority"
                count={priorityStats.low}
                value={priorityStats.lowPercent}
                color="#0284c7"
              />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Admin view only table */}
      {isAdmin && <UserBreakdownTable tasks={tasks} />}
    </Box>
  );
}
