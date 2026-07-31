import React from 'react';
import { Card, CardContent, Typography, Checkbox, IconButton, Box, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StatusChip from '@/components/common/StatusChip';
import type { Task } from '@/types/task.types';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: Task['status']) => void;
}

// React.memo optimization: Prevents re-rendering this individual item
// when other unrelated items or filter parameters change in the parent view.
export const TaskItem = React.memo(function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskItemProps) {
  const isCompleted = task.status === 'completed';

  const checkIsOverdue = () => {
    if (isCompleted || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
  };

  const overdue = checkIsOverdue();

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        opacity: isCompleted ? 0.8 : 1,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
        },
        borderLeft: '4px solid',
        borderLeftColor:
          task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#0284c7',
      }}
    >
      <CardContent sx={{ py: '16px !important', px: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}>
          <Checkbox
            checked={isCompleted}
            onChange={() => onToggleStatus(task.id, task.status)}
            color="primary"
            sx={{ mt: -0.5 }}
          />

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? 'text.secondary' : 'text.primary',
                wordBreak: 'break-word',
              }}
            >
              {task.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mb: 1.5,
                wordBreak: 'break-word',
                fontSize: '0.875rem',
              }}
            >
              {task.description}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <StatusChip type="status" value={task.status} />
              <StatusChip type="priority" value={task.priority} />

              {task.dueDate && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 0.5,
                    alignItems: 'center',
                    ml: 1,
                    color: overdue ? 'error.main' : 'text.secondary',
                    fontSize: '0.75rem',
                    fontWeight: overdue ? 600 : 500,
                  }}
                >
                  {overdue ? <WarningAmberIcon fontSize="inherit" /> : <CalendarMonthIcon fontSize="inherit" />}
                  <span>
                    Due: {task.dueDate} {overdue && '(Overdue)'}
                  </span>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, alignSelf: 'flex-start' }}>
            <Tooltip title="Edit task">
              <IconButton size="small" onClick={() => onEdit(task)} color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete task">
              <IconButton size="small" onClick={() => onDelete(task.id)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

export default TaskItem;
