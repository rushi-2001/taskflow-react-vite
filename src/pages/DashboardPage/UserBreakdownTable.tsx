import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Card, CardContent } from '@mui/material';
import { Task } from '@/types/task.types';
import { seedUsers } from '@/api/mock/seedData';

interface UserBreakdownTableProps {
  tasks: Task[];
}

export default function UserBreakdownTable({ tasks }: UserBreakdownTableProps) {
  const userStats = seedUsers.map((user) => {
    const userTasks = tasks.filter((t) => t.ownerId === user.id);
    const total = userTasks.length;
    const completed = userTasks.filter((t) => t.status === 'completed').length;
    const inProgress = userTasks.filter((t) => t.status === 'in-progress').length;
    const pending = userTasks.filter((t) => t.status === 'pending').length;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      total,
      completed,
      inProgress,
      pending,
    };
  });

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          User Assignment Breakdown
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
          Administrators only. Summarizing task volumes and execution status per employee.
        </Typography>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Total Tasks</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Pending</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>In Progress</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userStats.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{row.role}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {row.total}
                  </TableCell>
                  <TableCell align="center" color="text.secondary">
                    {row.pending}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'warning.main' }}>
                    {row.inProgress}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'success.main' }}>
                    {row.completed}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
