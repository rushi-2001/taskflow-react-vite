import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks } from '@/store/tasks/task.actions';
import { selectAllTasks, selectTaskStats, selectTasksStatus } from '@/store/tasks/task.selectors';

export function useDashboardPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const status = useAppSelector(selectTasksStatus);
  const stats = useAppSelector(selectTaskStats);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const chartData = useMemo(() => {
    return [
      { name: 'Completed', value: stats.completed },
      { name: 'In Progress', value: stats.inProgress },
      { name: 'Pending', value: stats.pending },
    ];
  }, [stats]);

  const isAdmin = user?.role === 'admin';
  const isLoading = status === 'loading' && tasks.length === 0;

  return {
    tasks,
    stats,
    chartData,
    isAdmin,
    isLoading,
  };
}
