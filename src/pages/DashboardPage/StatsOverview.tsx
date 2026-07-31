import { Grid } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import StatCard from '@/components/common/StatCard';

interface StatsOverviewProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Tasks"
          value={stats.total}
          color="primary"
          icon={<AssignmentIcon />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Completed"
          value={stats.completed}
          color="success"
          icon={<CheckCircleIcon />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          color="warning"
          icon={<PendingActionsIcon />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Pending"
          value={stats.pending}
          color="info"
          icon={<HourglassEmptyIcon />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Overdue"
          value={stats.overdue}
          color="error"
          icon={<ReportProblemIcon />}
        />
      </Grid>
    </Grid>
  );
}
