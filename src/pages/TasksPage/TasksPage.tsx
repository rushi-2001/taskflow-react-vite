import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Typography, Button, Alert, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  clearTaskError,
  selectAllTasks,
  selectTasksStatus,
  selectTasksError,
} from '@/features/tasks/taskSlice';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useUI } from '@/context/UIContext';
import { seedUsers } from '@/api/mock/seedData';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import TaskFormDialog from './TaskFormDialog';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loader from '@/components/common/Loader';
import type { Task, TaskDraft } from '@/types/task.types';

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const status = useAppSelector(selectTasksStatus);
  const error = useAppSelector(selectTasksError);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { showNotification } = useUI();

  const isAdmin = currentUser?.role === 'admin';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>(() => seedUsers.map((u) => u.id));
  const [sortBy, setSortBy] = useState('createdAt_desc');

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearTaskError());
    };
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('all');
    setSortBy('createdAt_desc');
    setSelectedUsers(seedUsers.map((u) => u.id));
  }, []);

  const tabCounts = useMemo(() => {
    const scopeTasks = isAdmin ? tasks.filter((t) => selectedUsers.includes(t.ownerId)) : tasks;
    return {
      all: scopeTasks.length,
      pending: scopeTasks.filter((t) => t.status === 'pending').length,
      'in-progress': scopeTasks.filter((t) => t.status === 'in-progress').length,
      completed: scopeTasks.filter((t) => t.status === 'completed').length,
    };
  }, [tasks, isAdmin, selectedUsers]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (isAdmin) {
      result = result.filter((t) => selectedUsers.includes(t.ownerId));
    }

    if (debouncedSearch.trim() !== '') {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'createdAt_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'dueDate_asc': {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        case 'dueDate_desc': {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, statusFilter, isAdmin, selectedUsers, debouncedSearch, sortBy]);

  const handleOpenCreate = useCallback(() => {
    setEditingTask(undefined);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const handleOpenDelete = useCallback((id: string) => {
    setDeletingTaskId(id);
    setDeleteOpen(true);
  }, []);

  const handleToggleStatus = useCallback(
    (id: string, currentStatus: Task['status']) => {
      const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      dispatch(updateTask({ id, updates: { status: nextStatus } }))
        .unwrap()
        .then((updated) => {
          showNotification(
            `Task marked as ${updated.status === 'completed' ? 'completed' : 'pending'}`,
            'success'
          );
        })
        .catch((err) => {
          showNotification(err.message || 'Failed to update task status', 'error');
        });
    },
    [dispatch, showNotification]
  );

  const handleFormSubmit = useCallback(
    (values: TaskDraft) => {
      if (editingTask) {
        dispatch(updateTask({ id: editingTask.id, updates: values }))
          .unwrap()
          .then(() => {
            showNotification('Task updated successfully', 'success');
            setFormOpen(false);
          })
          .catch((err) => {
            showNotification(err.message || 'Failed to update task', 'error');
          });
      } else {
        dispatch(createTask(values))
          .unwrap()
          .then(() => {
            showNotification('Task created successfully', 'success');
            setFormOpen(false);
          })
          .catch((err) => {
            showNotification(err.message || 'Failed to create task', 'error');
          });
      }
    },
    [dispatch, editingTask, showNotification]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deletingTaskId) return;

    dispatch(deleteTask(deletingTaskId))
      .unwrap()
      .then(() => {
        showNotification('Task deleted successfully', 'success');
        setDeleteOpen(false);
        setDeletingTaskId(null);
      })
      .catch((err) => {
        showNotification(err.message || 'Failed to delete task', 'error');
      });
  }, [dispatch, deletingTaskId, showNotification]);

  const hasActiveFilters =
    search !== '' ||
    statusFilter !== 'all' ||
    (isAdmin && selectedUsers.length !== seedUsers.length);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Project Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage, organize, and track your ongoing project tasks.
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Create Task
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          onClose={() => dispatch(clearTaskError())}
          sx={{ mb: 3, borderRadius: 1 }}
        >
          {error}
        </Alert>
      )}

      <Tabs
        value={statusFilter}
        onChange={(_, newValue) => setStatusFilter(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab
          label={`All (${tabCounts.all})`}
          value="all"
          sx={{ fontWeight: 600, textTransform: 'none' }}
        />
        <Tab
          label={`TODO (${tabCounts.pending})`}
          value="pending"
          sx={{ fontWeight: 600, textTransform: 'none' }}
        />
        <Tab
          label={`In Progress (${tabCounts['in-progress']})`}
          value="in-progress"
          sx={{ fontWeight: 600, textTransform: 'none' }}
        />
        <Tab
          label={`Completed (${tabCounts.completed})`}
          value="completed"
          sx={{ fontWeight: 600, textTransform: 'none' }}
        />
      </Tabs>

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        isAdmin={isAdmin}
        selectedUsers={selectedUsers}
        onSelectedUsersChange={setSelectedUsers}
      />

      {status === 'loading' && tasks.length === 0 ? (
        <Loader />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
          onClearFilters={handleClearFilters}
          isFiltered={hasActiveFilters}
        />
      )}

      <TaskFormDialog
        open={formOpen}
        task={editingTask}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={status === 'loading'}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action is permanent and cannot be undone."
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
        isLoading={status === 'loading'}
      />
    </Box>
  );
}

