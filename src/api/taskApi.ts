import { axiosClient } from './axiosClient';
import type { Task, TaskDraft } from '@/types/task.types';

export const fetchTasks = (): Promise<Task[]> => {
  return axiosClient.get<Task[]>('/tasks').then((r) => r.data);
};

export const createTask = (task: TaskDraft): Promise<Task> => {
  return axiosClient.post<Task>('/tasks', task).then((r) => r.data);
};

export const updateTask = (id: string, task: Partial<Task>): Promise<Task> => {
  return axiosClient.put<Task>(`/tasks/${id}`, task).then((r) => r.data);
};

export const deleteTask = (id: string): Promise<{ message: string; id: string }> => {
  return axiosClient.delete<{ message: string; id: string }>(`/tasks/${id}`).then((r) => r.data);
};
