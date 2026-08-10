import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectAllTasks } from '@/store/tasks/task.selectors';
import { seedUsers } from '@/api/mock/seedData';

export function useAdminPage() {
  const tasks = useAppSelector(selectAllTasks);

  const userStats = useMemo(() => {
    const totalUsers = seedUsers.length;
    const adminUsers = seedUsers.filter((u) => u.role === 'admin').length;
    const standardUsers = seedUsers.filter((u) => u.role === 'user').length;

    return { totalUsers, adminUsers, standardUsers };
  }, []);

  return {
    tasks,
    ...userStats,
  };
}
