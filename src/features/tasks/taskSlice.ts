import { createSlice } from '@reduxjs/toolkit';
import { Task } from '@/types/task.types';

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

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
});

export default taskSlice.reducer;
