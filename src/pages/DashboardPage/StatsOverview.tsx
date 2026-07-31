import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import StatCard from '@/components/common/StatCard';
import { Box } from '@mui/material';

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 3,
        mb: 4,
      }}
    >
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' } }}>
        <StatCard
          title="Total Tasks"
          value={stats.total}
          color="primary"
          icon={<AssignmentIcon />}
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' } }}>
        <StatCard
          title="Completed"
          value={stats.completed}
          color="success"
          icon={<CheckCircleIcon />}
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' } }}>
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          color="warning"
          icon={<PendingActionsIcon />}
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' } }}>
        <StatCard
          title="Pending"
          value={stats.pending}
          color="info"
          icon={<HourglassEmptyIcon />}
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' } }}>
        <StatCard
          title="Overdue"
          value={stats.overdue}
          color="error"
          icon={<ReportProblemIcon />}
        />
      </Box>
    </Box>
  );
}
