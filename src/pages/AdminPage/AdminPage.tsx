import { Box, Typography, Grid } from '@mui/material';
import { useAppSelector } from '@/app/hooks';
import UserBreakdownTable from '../DashboardPage/UserBreakdownTable';
import StatCard from '@/components/common/StatCard';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { selectAllTasks } from '@/features/tasks/taskSlice';
import { seedUsers } from '@/api/mock/seedData';

export default function AdminPage() {
  const tasks = useAppSelector(selectAllTasks);

  const totalUsers = seedUsers.length;
  const adminUsers = seedUsers.filter((u) => u.role === 'admin').length;
  const standardUsers = seedUsers.filter((u) => u.role === 'user').length;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
          Admin Panel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage system users and view detailed assignment metrics.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Users"
            value={totalUsers}
            color="primary"
            icon={<PeopleIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Administrators"
            value={adminUsers}
            color="warning"
            icon={<AdminPanelSettingsIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Standard Users"
            value={standardUsers}
            color="info"
            icon={<PeopleIcon />}
          />
        </Grid>
      </Grid>

      <UserBreakdownTable tasks={tasks} />
    </Box>
  );
}
