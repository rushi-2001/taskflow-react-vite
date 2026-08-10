import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/store/tasks/task.actions';
import { selectAllTasks, selectTasksStatus, selectTasksError } from '@/store/tasks/task.selectors';
import { clearTaskError } from '@/store/tasks/taskSlice';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useUI } from '@/context/UIContext';
import { seedUsers } from '@/api/mock/seedData';
import type { Task, TaskDraft } from '@/types/task.types';

export function useTasksPage() {
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

  const handleClearError = useCallback(() => {
    dispatch(clearTaskError());
  }, [dispatch]);

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

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteOpen(false);
    setDeletingTaskId(null);
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

  return {
    tasks,
    status,
    error,
    isAdmin,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedUsers,
    setSelectedUsers,
    sortBy,
    setSortBy,
    formOpen,
    editingTask,
    deleteOpen,
    tabCounts,
    filteredTasks,
    hasActiveFilters,
    handleClearFilters,
    handleClearError,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleCloseForm,
    handleCloseDelete,
    handleToggleStatus,
    handleFormSubmit,
    handleDeleteConfirm,
  };
}
