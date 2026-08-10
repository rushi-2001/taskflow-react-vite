import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Task, TaskDraft } from '@/types/task.types';
import * as taskApi from '@/api/taskApi';
import type { NormalizedApiError } from '@/types/api.types';

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: NormalizedApiError }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      return await taskApi.fetchTasks();
    } catch (err) {
      return rejectWithValue(err as NormalizedApiError);
    }
  }
);

export const createTask = createAsyncThunk<Task, TaskDraft, { rejectValue: NormalizedApiError }>(
  'tasks/createTask',
  async (draft, { rejectWithValue }) => {
    try {
      return await taskApi.createTask(draft);
    } catch (err) {
      return rejectWithValue(err as NormalizedApiError);
    }
  }
);

export const updateTask = createAsyncThunk<
  Task,
  { id: string; updates: Partial<Task> },
  { rejectValue: NormalizedApiError }
>('tasks/updateTask', async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await taskApi.updateTask(id, updates);
  } catch (err) {
    return rejectWithValue(err as NormalizedApiError);
  }
});

export const deleteTask = createAsyncThunk<string, string, { rejectValue: NormalizedApiError }>(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      const res = await taskApi.deleteTask(id);
      return res.id;
    } catch (err) {
      return rejectWithValue(err as NormalizedApiError);
    }
  }
);
