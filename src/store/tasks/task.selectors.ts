import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectAllTasks = (state: RootState) => state.tasks.items;
export const selectTasksStatus = (state: RootState) => state.tasks.status;
export const selectTasksError = (state: RootState) => state.tasks.error;

export const selectTaskStats = createSelector([selectAllTasks], (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdue = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate < todayStr
  ).length;

  return { total, completed, pending, inProgress, overdue };
});
