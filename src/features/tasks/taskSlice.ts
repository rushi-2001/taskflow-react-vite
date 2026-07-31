import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { Task, TaskDraft } from '@/types/task.types';
import * as taskApi from '@/api/taskApi';
import { NormalizedApiError } from '@/types/api.types';
import { RootState } from '@/app/store';

interface TaskState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---

export const fetchTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: NormalizedApiError }
>('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    return await taskApi.fetchTasks();
  } catch (err) {
    return rejectWithValue(err as NormalizedApiError);
  }
});

export const createTask = createAsyncThunk<
  Task,
  TaskDraft,
  { rejectValue: NormalizedApiError }
>('tasks/createTask', async (draft, { rejectWithValue }) => {
  try {
    return await taskApi.createTask(draft);
  } catch (err) {
    return rejectWithValue(err as NormalizedApiError);
  }
});

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

export const deleteTask = createAsyncThunk<
  string, // Returns the ID of the deleted task
  string,
  { rejectValue: NormalizedApiError }
>('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    const res = await taskApi.deleteTask(id);
    return res.id;
  } catch (err) {
    return rejectWithValue(err as NormalizedApiError);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Failed to load tasks';
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Failed to create task';
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Failed to update task';
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Failed to delete task';
      });
  },
});

export const { clearTaskError } = taskSlice.actions;

// --- SELECTORS ---

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

export default taskSlice.reducer;
