import TaskItem from './TaskItem';
import EmptyState from '@/components/common/EmptyState';
import type { Task } from '@/types/task.types';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: Task['status']) => void;
  onClearFilters?: () => void;
  isFiltered?: boolean;
}

export default function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  onClearFilters,
  isFiltered = false,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title={isFiltered ? 'No matching tasks' : 'No tasks created yet'}
        description={
          isFiltered
            ? 'Try adjusting your search query or status tab filters.'
            : 'Click on "Create Task" above to add your first work item.'
        }
        icon={<AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />}
        actionText={isFiltered ? 'Clear Filters' : undefined}
        onAction={isFiltered ? onClearFilters : undefined}
      />
    );
  }

  return (
    <>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </>
  );
}
