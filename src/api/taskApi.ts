import { axiosClient } from './axiosClient';
import type { Task, TaskDraft } from '@/types/task.types';

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axiosClient.get<Task[]>('/tasks');
  return response.data;
};

export const createTask = async (task: TaskDraft): Promise<Task> => {
  const response = await axiosClient.post<Task>('/tasks', task);
  return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const response = await axiosClient.put<Task>(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<{ message: string; id: string }> => {
  const response = await axiosClient.delete<{ message: string; id: string }>(`/tasks/${id}`);
  return response.data;
};
