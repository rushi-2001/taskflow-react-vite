export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface TaskDraft {
  title: string;
  description: string;
  priority: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
}
